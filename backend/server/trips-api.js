const express = require('express');
const tripsRouter = express.Router();
const {pool} = require('./db');
const {isValidDate, validateHhMm} = require('./utils');
const format = require('pg-format');


// Middlewares
tripsRouter.use((req, res, next) => {
    if (!req.user) {
        return res.status(401).json({msg: 'You need to login first'});
    }
    next();
});


tripsRouter.use('/trips/:trip_id', async (req, res, next) => {
    try {
        const check = await pool.query('select * from trips where id = $1', [req.params.trip_id]);
        if (check.rows.length === 0) {
            return res.status(400).json({ msg: 'invalid trip id' });
        }
        next();
    } catch(e) {
        res.status(500).json({msg: 'Server error'});
    }
});


tripsRouter.use('/trips/:trip_id', async (req, res, next) => {
    try {
        const check = await pool.query('select * from trips_shared where trip_id = $1 and user_id = $2', [req.params.trip_id, req.user.id]);
        if (check.rows.length === 0) {
            return res.status(400).json({ msg: 'Unauthorized' });
        }
        next();
    } catch(e) {
        res.status(500).json({msg: 'Server error'});
    }
});


tripsRouter.use(['/trips/:trip_id/activities/:activity_id', '/trips/:trip_id/activities/:activity_id/comments/:comment_id'], async (req, res, next) => {
    try {
        const check = await pool.query('select * from activities where id = $1 and trip_id = $2', [req.params.activity_id, req.params.trip_id]);
        if (check.rows.length === 0) {
            return res.status(400).json({ msg: 'invalid id' });
        }
        next();
    } catch(e) {
        res.status(500).json({msg: 'Server error'});
    }
});


tripsRouter.use('/trips/:trip_id/activities/:activity_id/comments/:comment_id', async (req, res, next) => {
    try {
        const check = await pool.query('select from activity_comments where id = $1 and activity_id = $2;', [req.params.comment_id, req.params.activity_id]);
        if (check.rows.length === 0) {
            return res.status(400).json({ msg: 'invalid comment id' });
        }
        next();
    } catch(e) {
        res.status(500).json({msg: 'Server error'});
    }
});

// Trips

// Get all trips-
tripsRouter.get('/trips', async (req, res, next) => { 
    try {
        const result = await pool.query('select t.* from trips t join trips_shared ts on t.id = ts.trip_id where ts.user_id = $1 order by t.start_date', [req.user.id]);
        const newResult = result.rows.map(el => ({...el, isCreatedByMe: el.created_by === req.user.id ? 1 : 0}));
        res.status(200).json(newResult);
    } catch (e) {
        res.status(500).json({msg: 'Server error'});
    }
});

async function sharingTrip(req, emails, tripId) {
    let userIds = [[tripId, req.user.id]];
    if (emails.length > 0) {
        const ids = await pool.query('select id from users where username = ANY ($1);', [emails]);
        if (ids.rows.length > 0) {
            const idsTrip = ids.rows.map(i => [tripId, i.id]);
            userIds.push(...idsTrip);
        }
    }
    await pool.query('delete from trips_shared where trip_id = $1;', [tripId]);
    await pool.query(format('insert into trips_shared (trip_id, user_id) values %L;', userIds));
};

// Post a new trip
tripsRouter.post('/trips', async (req, res, next) => {
    const { country, city, start_date, end_date, emails, photo } = req.body;

    if (!country || !city || !start_date || !end_date || !emails) {
        return res.status(400).json({ msg: 'All fields should be specified' });
    };

    if (!isValidDate(start_date) || !isValidDate(end_date)) {
        return res.status(400).json({msg: 'invalid date format'});
    }

    try {
        const result = await pool.query('insert into trips (country, city, start_date, end_date, created_by, photo) values ($1, $2, $3, $4, $5, $6) returning *;', [country, city, new Date(start_date), new Date(end_date), req.user.id, photo]);
        await sharingTrip(req, emails, result.rows[0].id);
        res.status(200).json(result.rows[0]);
    } catch (e) {
        res.status(500).json({msg: 'Server error'});
    }
});


// Get a specific trip
tripsRouter.get('/trips/:trip_id', async (req, res, next) => {
    try {
        const trip = await pool.query('select * from trips where id = $1', [req.params.trip_id]);
        const userData = await pool.query('select u.username, u.nickname from trips t join trips_shared ts on t.id = ts.trip_id join users u on ts.user_id = u.id where t.id = $1 and u.id <> $2', [trip.rows[0].id, req.user.id])
        let result = trip.rows[0];
        result.userData = userData.rows;
        res.status(200).json(result);
    } catch (e) {
        res.status(500).json({msg: 'Server error'});
    }
});


const checkedTripAuth = async (req, res, next) => {
    try {
        const userId = await pool.query('select created_by from trips where id = $1;', [req.params.trip_id]);
        if (req.user.id !== userId.rows[0].created_by) {
            return res.status(401).json({msg: 'Unauthorized'});
        }
        next();
    } catch (e) {
        console.log(e);
        return res.status(500).json({msg: 'Server error'});
    }
};


// Update a specific trip
tripsRouter.put('/trips/:trip_id', checkedTripAuth, async (req, res, next) => { 
    const { country, city, start_date, end_date, emails, photo } = req.body;

    if (!country || !city || !start_date || !end_date || !emails) {
        return res.status(400).json({ msg: 'All fields should be specified' });
    };

    if (!isValidDate(start_date) || !isValidDate(end_date)) {
        return res.status(400).json({ msg: 'invalid date format' });
    }

    try {
        const result = await pool.query('update trips set country = $2, city = $3, start_date = $4, end_date = $5, photo = $6 where id = $1 returning *;', [req.params.trip_id, country, city, new Date(start_date), new Date(end_date), photo]);
        await sharingTrip(req, emails, result.rows[0].id);
        res.status(200).json(result.rows[0]);
    } catch(e) {
        res.status(500).json({msg: 'Server error'});
    }
});


// Delete a specific trip
tripsRouter.delete('/trips/:trip_id', checkedTripAuth, async (req, res, next) => {
    try {
        //const check = await pool.query('select * from trips where id = $1', [req.params.trip_id]);
        await pool.query('delete from trips where id = $1;', [req.params.trip_id]);
        res.status(200).json({ msg: 'Deleted trip' });
    } catch (e) {
        console.log(e);
        res.status(500).json({msg: 'Server error'});
    }
});

// Activities

// Get all activities-
tripsRouter.get('/trips/:trip_id/activities', async (req, res, next) => {
    try {
        const result = await pool.query('select * from activities where trip_id = $1 order by date, start_time', [req.params.trip_id]);
        res.status(200).json(result.rows);
    } catch(e) {
        res.status(500).json({msg: 'Server error'});
    }
});


// Post a new activity
tripsRouter.post('/trips/:trip_id/activities', async (req, res, next) => {
    const { date, activity_name, address, activityURL, start_time, end_time, user_notes, type, address_lat, address_lng } = req.body;

    if (!date || !activity_name || !start_time || !end_time) {
        return res.status(400).json({ msg: 'Date, activity_name, start_time and end_time must be specified' });
    };

    if (!validateHhMm(start_time) || !validateHhMm(end_time)) {
        return res.status(400).json({ msg: 'The start time and end time must be in the correct format' });
    }

    if (!isValidDate(date)) {
        return res.status(400).json({ msg: 'The date must be in the correct format' });
    }

    try {
        const result = await pool.query('insert into activities (date, trip_id, activity_name, address, url, start_time, end_time, user_id, user_notes, type, address_lat, address_lng) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) returning *;',
            [new Date(date), req.params.trip_id, activity_name, address, activityURL, start_time, end_time, req.user.id, user_notes, type, address_lat, address_lng]);
        res.status(200).json(result.rows[0]);
    } catch (e) {
        res.status(500).json({msg: 'Server error'});
    }
});


// Get a specific activity
tripsRouter.get('/trips/:trip_id/activities/:activity_id', async (req, res, next) => {
    try {
        const result = await pool.query('select * from activities where id = $1 and trip_id = $2', [req.params.activity_id, req.params.trip_id]);
        res.status(200).json(result.rows[0]);
    } catch(e) {
        res.status(500).json({msg: 'Server error'});
    }
});


// Update a specific activity
tripsRouter.put('/trips/:trip_id/activities/:activity_id', async (req, res, next) => {
    const { date, activity_name, address, activityURL, start_time, end_time, user_notes, type, address_lat, address_lng } = req.body;

    if (!date || !activity_name || !start_time || !end_time) {
        return res.status(400).json({ msg: 'Date, activity_name, start_time and end_time must be specified' });
    };

    if(!validateHhMm(start_time) || !validateHhMm(end_time)) {
        return res.status(400).json({ msg: 'The start time and end time must be in the correct format' });
    }

    if (!isValidDate(date)) {
        return res.status(400).json({msg: 'The date must be in the correct format'});
    }

    try {
        const result = await pool.query('update activities set date = $2, trip_id = $3, activity_name = $4, address = $5, url = $6, start_time = $7, end_time = $8, user_id = $9, user_notes = $10, type = $11, address_lat = $12, address_lng =$13 where id = $1 and trip_id = $3 returning *;', 
        [req.params.activity_id, new Date(date), req.params.trip_id, activity_name, address, activityURL, start_time, end_time, req.user.id, user_notes, type, address_lat, address_lng]);
        res.status(200).json(result.rows[0]);
    } catch(e) {
        res.status(500).json({msg: 'Server error'});
    }
});


// Delete a specific activity
tripsRouter.delete('/trips/:trip_id/activities/:activity_id', async (req, res, next) => {
    try {
        await pool.query('delete from activities where id = $1 and trip_id = $2;', [req.params.activity_id, req.params.trip_id]);
        res.status(200).json({ msg: 'Deleted activity' });
    } catch(e) {
        res.status(500).json({msg: 'Server error'});
    }
});


// Comments

const checkedCommentAuth = async (req, res, next) => {
    try {
        const userId = await pool.query('select user_id from activity_comments where id = $1;', [req.params.comment_id]);
        if (req.user.id !== userId.rows[0].user_id) {
            return res.status(401).json({msg: 'Unauthorized'});
        }
        next();
    } catch (e) {
        console.log(e);
        return res.status(500).json({msg: 'Server error'});
    }
};


// Get all comments-
tripsRouter.get('/trips/:trip_id/activities/:activity_id/comments', async (req, res, next) => {
    try {
        const result = await pool.query('select ac.*, u.nickname from activities a join activity_comments ac on a.id = ac.activity_id join users u on ac.user_id = u.id where a.id = $1 and a.trip_id = $2;', [req.params.activity_id, req.params.trip_id]);
        const newResult = result.rows.map(el => ({...el, isCreatedByMe: el.user_id === req.user.id ? 1 : 0}));
        res.status(200).json(newResult);
    } catch(e) {
        res.status(500).json({msg: 'Server error'});
    }
});


// Post a new comment
tripsRouter.post('/trips/:trip_id/activities/:activity_id/comments', async (req, res, next) => {
    const { comment } = req.body;

    if (!comment) {
        return res.status(400).json({ msg: 'Needs comment text to publish' });
    };

    try {
        const timestamp = new Date(Date.now());
        const result = await pool.query('insert into activity_comments (activity_id, user_id, comment, timestamp) values ($1, $2, $3, $4) returning *;', [req.params.activity_id, req.user.id, comment, timestamp]);
        res.status(200).json(result.rows[0]);
    } catch(e) {
        res.status(500).json({msg: 'Server error'});
    }
});


// Update a specific comment
tripsRouter.put('/trips/:trip_id/activities/:activity_id/comments/:comment_id', checkedCommentAuth, async (req, res, next) => {
    const { comment } = req.body;

    if (!comment) {
        return res.status(400).json({ msg: 'Needs comment text to publish' });
    };

    try {
        const timestamp = new Date(Date.now());
        const result = await pool.query('update activity_comments set activity_id = $2, user_id = $3, comment = $4, timestamp = $5 where id = $1 returning *;', [req.params.comment_id, req.params.activity_id, req.user.id, comment, timestamp]);
        res.status(200).json(result.rows[0]);
    } catch (e) {
        res.status(500).json({msg: 'Server error'});
    }
});


// Delete a specific comment
tripsRouter.delete('/trips/:trip_id/activities/:activity_id/comments/:comment_id', checkedCommentAuth, async (req, res, next) => {
    try {
        await pool.query('delete from activity_comments where id = $1 and activity_id = $2;', [req.params.comment_id, req.params.activity_id]);
        res.status(200).json({ msg: 'Deleted comment' });
    } catch(e) {
        res.status(500).json({msg: 'Server error'});
    }
});


module.exports = tripsRouter;