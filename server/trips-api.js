const express = require('express');
const tripsRouter = express.Router();
const {query} = require('./db');


tripsRouter.use((req, res, next) => {
    if (!req.user) {
        return res.status(401).json({msg: 'You need to login first'});
    }
    next();
});


function isValidDate(dateString) {
    return !isNaN(Date.parse(dateString));
}


function validateHhMm(inputField) {
    const isValid = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test(inputField);
    return isValid;
}


// Trips

// Get all trips-
tripsRouter.get('/trips', (req, res, next) => {
    query('select * from trips', (error, results) => {
        if (error) {
            return res.status(500);
        }
        res.status(200).json(results.rows);
      });
});


// Post a new trip
tripsRouter.post('/trips', (req, res, next) => {
    const { country, city, start_date, end_date } = req.body;

    if (country === undefined || city === undefined || start_date === undefined || end_date === undefined) {
        return res.status(400).json({ msg: 'All fields should be specified' });
    };

    if (!isValidDate(start_date) || !isValidDate(end_date)) {
        return res.status(400).json({msg: 'The start date and end date must be in the correct format'});
    }

    query('insert into trips (country, city, start_date, end_date) values ($1, $2, $3, $4);', [country, city, start_date, end_date], 
        (error, results) => {
            if (error) {
                return res.status(500);
            }
            res.status(200).json({msg: 'Added trip'});
        }
    );
});


// Get a specific trip
tripsRouter.get('/trips/:trip_id', (req, res, next) => {
    query('select * from trips where id = $1', [req.params.trip_id], (error, results) => {
        if (error) {
            return res.status(500);
        }

        if (results.rows.length === 0) {
            return res.status(400).json({msg: 'Please choose a different trip, this one is not in the system'});
        }

        res.status(200).json(results.rows[0]);
      });
});


// Update a specific trip
tripsRouter.put('/trips/:trip_id', (req, res, next) => {
    const { country, city, start_date, end_date } = req.body;

    if (country === undefined || city === undefined || start_date === undefined || end_date === undefined) {
        return res.status(400).json({ msg: 'All fields should be specified' });
    };

    if (!isValidDate(start_date) || !isValidDate(end_date)) {
        return res.status(400).json({ msg: 'The start date and end date must be in the correct format' });
    }

    query('select * from trips where id = $1', [req.params.trip_id], (error, results) => {
        if (error) {
            return res.status(500);
        }

        if (results.rows.length === 0) {
            return res.status(400).json({ msg: 'Please choose a different trip, this one is not in the system' });
        }

        query('update trips set country = $2, city = $3, start_date = $4, end_date = $5 where id = $1;', [req.params.trip_id, country, city, start_date, end_date],
            (error, results) => {
                if (error) {
                    return res.status(500);
                }
                res.status(200).json({ msg: 'Updated trip' });
            }
        );
    }
    );
});


// Delete a specific trip
tripsRouter.delete('/trips/:trip_id', (req, res, next) => {
    query('select * from trips where id = $1', [req.params.trip_id], (error, results) => {
        if (error) {
            return res.status(500);
        }

        if (results.rows.length === 0) {
            return res.status(400).json({ msg: 'Please choose a different trip, this one is not in the system' });
        }

        query('delete from trips where id = $1;', [req.params.trip_id],
            (error, results) => {
                if (error) {
                    return res.status(500);
                }
                res.status(200).json({ msg: 'Deleted trip' });
            }
        );
    }
    );
});

// Activities

// Get all activities-
tripsRouter.get('/trips/:trip_id/activities', (req, res, next) => {
    query('select * from activities where trip_id = $1', [req.params.trip_id], (error, results) => {
        if (error) {
            return res.status(500);
        }

        if (results.rows.length === 0) {
            return res.status(400).json({ msg: 'Please choose a different trip, this one does not have activities yet' });
        }

        res.status(200).json(results.rows);
      });
});


// Post a new activity
tripsRouter.post('/trips/:trip_id/activities', (req, res, next) => {
    const { date, activity_name, address, url, start_time, end_time, user_notes } = req.body;

    if (date === undefined || activity_name === undefined || start_time === undefined || end_time === undefined) {
        return res.status(400).json({ msg: 'Date, activity_name, start_time and end_time must be specified' });
    };

    if(!validateHhMm(start_time) || !validateHhMm(end_time)) {
        return res.status(400).json({ msg: 'The start time and end time must be in the correct format' });
    }

    if (!isValidDate(date)) {
        return res.status(400).json({msg: 'The date must be in the correct format'});
    }

    query('insert into activities (date, trip_id, activity_name, address, url, start_time, end_time, user_id, user_notes) values ($1, $2, $3, $4, $5, $6, $7, $8, $9);', 
        [date, req.params.trip_id, activity_name, address, url, start_time, end_time, req.user.id, user_notes], 
        (error, results) => {
            if (error) {
                return res.status(500);
            }
            res.status(200).json({msg: 'Added activity'});
        }
    );
});


// Get a specific activity
tripsRouter.get('/trips/:trip_id/activities/:activity_id', (req, res, next) => {
    query('select * from activities where id = $1 and trip_id = $2', [req.params.activity_id, req.params.trip_id], (error, results) => {
        if (error) {
            return res.status(500);
        }

        if (results.rows.length === 0) {
            return res.status(400).json({msg: 'Please choose a different activity, this one is not in the system'});
        }

        res.status(200).json(results.rows[0]);
      });
});


// Update a specific activity
tripsRouter.put('/trips/:trip_id/activities/:activity_id', (req, res, next) => {
    const { date, activity_name, address, url, start_time, end_time, user_notes } = req.body;

    if (date === undefined || activity_name === undefined || start_time === undefined || end_time === undefined) {
        return res.status(400).json({ msg: 'Date, activity_name, start_time and end_time must be specified' });
    };

    if(!validateHhMm(start_time) || !validateHhMm(end_time)) {
        return res.status(400).json({ msg: 'The start time and end time must be in the correct format' });
    }

    if (!isValidDate(date)) {
        return res.status(400).json({msg: 'The date must be in the correct format'});
    }

    query('select * from activities where id = $1 and trip_id = $2;', [req.params.activity_id, req.params.trip_id], (error, results) => {
        if (error) {
            return res.status(500);
        }

        if (results.rows.length === 0) {
            return res.status(400).json({ msg: 'Please choose a different activity, this one is not in the system' });
        }

        query('update activities set date = $2, trip_id = $3, activity_name = $4, address = $5, url = $6, start_time = $7, end_time = $8, user_id = $9, user_notes = $10 where id = $1 and trip_id = $3;', 
        [req.params.activity_id, date, req.params.trip_id, activity_name, address, url, start_time, end_time, req.user.id, user_notes],
            (error, results) => {
                if (error) {
                    return res.status(500);
                }
                res.status(200).json({ msg: 'Updated activity' });
            }
        );
    }
    );
});


// Delete a specific activity
tripsRouter.delete('/trips/:trip_id/activities/:activity_id', (req, res, next) => {
    query('select * from activities where id = $1 and trip_id = $2;', [req.params.activity_id, req.params.trip_id], (error, results) => {
        if (error) {
            return res.status(500);
        }

        if (results.rows.length === 0) {
            return res.status(400).json({ msg: 'Please choose a different activity, this one is not in the system' });
        }

        query('delete from activities where id = $1 and trip_id = $2;', [req.params.activity_id, req.params.trip_id],
            (error, results) => {
                if (error) {
                    return res.status(500);
                }
                res.status(200).json({ msg: 'Deleted activity' });
            }
        );
    }
    );
});


// Comments

// Get all comments-
tripsRouter.get('/trips/:trip_id/activities/:activity_id/comments', (req, res, next) => {
    query('select ac.* from activities a join activity_comments ac on a.id = ac.activity_id where a.id = $1 and a.trip_id = $2;', [req.params.activity_id, req.params.trip_id], (error, results) => {
        if (error) {
            return res.status(500);
        }

        if (results.rows.length === 0) {
            return res.status(400).json({ msg: 'Please choose a different activity, this one does not have comments yet' });
        }

        res.status(200).json(results.rows);
      });
});


// Post a new comment
tripsRouter.post('/trips/:trip_id/activities/:activity_id/comments', (req, res, next) => {
    const { comment } = req.body;

    if (comment === undefined) {
        return res.status(400).json({ msg: 'Needs comment text to publish' });
    };

    query('select * from activities where id = $1 and trip_id = $2;', [req.params.activity_id, req.params.trip_id], (error, results) => {
        if (error) {
            return res.status(500);
        }

        if (results.rows.length === 0) {
            return res.status(400).json({ msg: 'Please choose a different activity or trip' });
        }

        const timestamp = new Date(Date.now());
        query('insert into activity_comments (activity_id, user_id, comment, timestamp) values ($1, $2, $3, $4);', [req.params.activity_id, req.user.id, comment, timestamp],
            (error, results) => {
                if (error) {
                    return res.status(500);
                }
                res.status(200).json({ msg: 'Added comment' });
            }
        );
    }
    );
});


// Update a specific comment
tripsRouter.put('/trips/:trip_id/activities/:activity_id/comments/:comment_id', (req, res, next) => {
    const { comment } = req.body;

    if (comment === undefined) {
        return res.status(400).json({ msg: 'Needs comment text to publish' });
    };

    query('select * from activities where id = $1 and trip_id = $2;', [req.params.activity_id, req.params.trip_id], (error, results) => {
        if (error) {
            return res.status(500);
        }

        if (results.rows.length === 0) {
            return res.status(400).json({ msg: 'Please choose a different activity or trip' });
        }

        const timestamp = new Date(Date.now());
        query('update activity_comments set activity_id = $2, user_id = $3, comment = $4, timestamp = $5 where id = $1;', [req.params.comment_id, req.params.activity_id, req.user.id, comment, timestamp],
            (error, results) => {
                if (error) {
                    return res.status(500);
                }
                res.status(200).json({ msg: 'Updated comment' });
            }
        );
    }
    );
});


// Delete a specific comment
tripsRouter.delete('/trips/:trip_id/activities/:activity_id/comments/:comment_id', (req, res, next) => {
    query('select * from activities where id = $1 and trip_id = $2;', [req.params.activity_id, req.params.trip_id], (error, results) => {
        if (error) {
            return res.status(500);
        }

        if (results.rows.length === 0) {
            return res.status(400).json({ msg: 'Please choose a different activity or trip' });
        }

        query('delete from activity_comments where id = $1 and activity_id = $2;', [req.params.comment_id, req.params.activity_id],
            (error, results) => {
                if (error) {
                    return res.status(500);
                }
                res.status(200).json({ msg: 'Deleted comment' });
            }
        );
    }
    );
});


module.exports = tripsRouter;