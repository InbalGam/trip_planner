const expect = require('chai').expect;
const request = require('supertest');
const {pool} = require('../server/db');

const app = require('../server');
const PORT = process.env.PORT || 4001;


// Authorization tests
describe('Login Authorization tests', function() {
    it('should pass auth check for log in', function() {
        const agent = request.agent(app);
        return agent
            .post('/login')
            .send({username: 'inbalG@gmail.com', password: 'inbalGHY'}) // User exist
            .redirects(1)
            .expect(200);
    });

    it('should NOT pass auth check for log in', function() {
        const agent = request.agent(app);
        return agent
            .post('/login')
            .send({username: 'Srasda34', password: 'bldadala23pppppp99'}) // User doesn't exist
            .redirects(1)
            .expect(401);
    });
});


describe('Register Authorization tests', function() {
    it('should NOT pass- all fields needs specification', function() {
        const agent = request.agent(app);
        return agent
            .post('/register')
            .send({username: 'ilG@gmail.com', password: 'inbalGHY'})
            .then((response) => {
                expect(response.body).to.be.deep.equal({msg: 'All fields should be specified'});
            });
    });

    it('should NOT pass- password length limitation', function() {
        const agent = request.agent(app);
        return agent
            .post('/register')
            .send({username: 'ilG@gmail.com', password: 'iHY', nickname: 'userNickname'})
            .then((response) => {
                expect(response.body).to.be.deep.equal({msg: 'Password needs to be at least 8 characters'});
            });
    });

    it('should NOT pass- username length limitation', function() {
        const agent = request.agent(app);
        return agent
            .post('/register')
            .send({username: 'us', password: 'passwordCHECK', nickname: 'userNickname'})
            .then((response) => {
                expect(response.body).to.be.deep.equal({msg: 'Username needs to be a valid email'});
            });
    });

    it('should NOT pass- nickname length limitation', function() {
        const agent = request.agent(app);
        return agent
            .post('/register')
            .send({username: 'inlG@gmail.com', password: 'passwordCHECK', nickname: 'us'})
            .then((response) => {
                expect(response.body).to.be.deep.equal({msg: 'Nickname needs to be at least 3 characters'});
            });
    });

    it('should NOT pass- username OR nickname already exist', function() {
        const agent = request.agent(app);
        return agent
            .post('/register')
            .send({username: 'inbalG@gmail.com', password: 'passwordCHECK', nickname: 'userNickname'})
            .then((response) => {
                expect(response.body).to.be.deep.equal({msg: 'Username or Nickname already exist, choose differently'});
            });
    });

    it('should pass- insert new user', function() {    // works- inserting to db users
        const agent = request.agent(app);
        return agent
            .post('/register')
            .send({username: 'inG@gmail.com', password: 'passwordCHECK', nickname: 'userNickname123424'}) // currently no mock DB so needs changing for username & nickname
            .expect(201)
            .then((response) => {
                expect(response.body).to.be.deep.equal({msg: 'Success creating user'});
            });
    });
});


describe('Logout Authorization tests', function() {
    it('should pass auth check for log out', function() {
        const agent = request.agent(app);
        return agent
            .get('/logout')
            .expect(200)
            .then((response) => {
                expect(response.body).to.be.deep.equal({msg: 'Successfully logged out'});
            });
    });
});



// Routes tests - with login
// Trip
describe('/trips routes', function () {
    it('GET /trips returns an array of trips', function () {
        const agent = request.agent(app);
        return agent
        .post('/login')
        .send({username: 'inbalG@gmail.com', password: 'inbalGHY'}) // User exist
        .redirects(1)
        .then(() => {
            return agent
            .get('/trips')  
        })
        .then((response) => {
            expect(response.body).to.be.an.instanceOf(Array);
        })
    });

    it('GET /trips returns an array of all trips', function () {
        const agent = request.agent(app);
        return agent
        .post('/login')
        .send({username: 'inbalG@gmail.com', password: 'inbalGHY'}) // User exist
        .redirects(1)
        .then(() => {
            return agent
            .get('/trips')
            .expect(200)
            .then(async (response) => {
                const results = await pool.query('select * from trips t join trips_shared ts on t.id = ts.trip_id where ts.user_id = 17');
                expect(response.body.length).to.be.equal(results.rows.length);
                response.body.forEach((trip) => {
                    expect(trip).to.have.ownProperty('id');
                    expect(trip).to.have.ownProperty('country');
                    expect(trip).to.have.ownProperty('city');
                    expect(trip).to.have.ownProperty('start_date');
                    expect(trip).to.have.ownProperty('end_date');
                    expect(trip).to.have.ownProperty('created_by');
                });
            });
        })
    });

    it('POST /trips should NOT post a new trip- needs all fields specified', function () {
        const agent = request.agent(app);
        return agent
        .post('/login')
        .send({username: 'inbalG@gmail.com', password: 'inbalGHY'}) // User exist
        .redirects(1)
        .then(() => {
            return agent
            .post('/trips')
            .send({country: undefined, city: 'Romecheck', start_date: '2023-05-01', end_date: '2023-05-09', emails: ['nirHALAY@gmail.com']})
            .expect(400)
            .then((response) => {
                expect(response.body).to.be.deep.equal({msg: 'All fields should be specified'});
            });
        })
    });

    it('POST /trips should NOT post a new trip- dates not in correct format', function () {
        const agent = request.agent(app);
        return agent
        .post('/login')
        .send({username: 'inbalG@gmail.com', password: 'inbalGHY'}) // User exist
        .redirects(1)
        .then(() => {
            return agent
            .post('/trips')
            .send({country: 'ItalCheck', city: 'Romecheck', start_date: '2023-15-01', end_date: '2023-05-09', emails: ['nirHALAY@gmail.com']})
            .expect(400)
            .then((response) => {
                expect(response.body).to.be.deep.equal({msg: 'invalid date format'});
            });
        })
    });

    it('POST /trips should insert a new trip', function () {  
        const agent = request.agent(app);
        return agent
        .post('/login')
        .send({username: 'inbalG@gmail.com', password: 'inbalGHY'}) // User exist
        .redirects(1)
        .then(() => {
            return agent
            .post('/trips')
            .send({country: 'ItalCheck', city: 'Romecheck', start_date: '2023-05-01', end_date: '2023-05-09', emails: ['nirHALAY@gmail.com']})
            .expect(200)
            .then((response) => {
                expect(response.body).to.have.ownProperty('id');
                expect(response.body).to.have.ownProperty('country');
                expect(response.body).to.have.ownProperty('city');
                expect(response.body).to.have.ownProperty('start_date');
                expect(response.body).to.have.ownProperty('end_date');
                expect(response.body).to.have.ownProperty('created_by');
            });
        })
    });

    it('GET /trips/:trip_id should NOT return a specific trip - id not created', function () {
        const agent = request.agent(app);
        return agent
        .post('/login')
        .send({username: 'inbalG@gmail.com', password: 'inbalGHY'}) // User exist
        .redirects(1)
        .then(() => {
            return agent
            .get('/trips/19')
            .expect(400)
            .then((response) => {
                expect(response.body).to.be.deep.equal({msg: 'invalid trip id'});
            });
        })
    });

    it('GET /trips/:trip_id should NOT return a specific trip - Unauthorized', function () {
        const agent = request.agent(app);
        return agent
        .post('/login')
        .send({username: 'inbalG@gmail.com', password: 'inbalGHY'}) // User exist
        .redirects(1)
        .then(() => {
            return agent
            .get('/trips/1')
            .expect(400)
            .then((response) => {
                expect(response.body).to.be.deep.equal({msg: 'Unauthorized'});
            });
        })
    });

    it('GET /trips/:trip_id should return a specific trip', function () {
        const agent = request.agent(app);
        return agent
        .post('/login')
        .send({username: 'inbalG@gmail.com', password: 'inbalGHY'}) // User exist
        .redirects(1)
        .then(() => {
            return agent
            .get('/trips/34')
            .expect(200)
            .then((response) => {
                expect(response.body).to.have.ownProperty('id');
                expect(response.body).to.have.ownProperty('country');
                expect(response.body).to.have.ownProperty('city');
                expect(response.body).to.have.ownProperty('start_date');
                expect(response.body).to.have.ownProperty('end_date');
                expect(response.body).to.have.ownProperty('created_by');
            });
        })
    });

    it('PUT /trips/:trip_id should NOT update a specific trip - all fields needs specification', function () {
        const agent = request.agent(app);
        return agent
        .post('/login')
        .send({username: 'inbalG@gmail.com', password: 'inbalGHY'}) // User exist
        .redirects(1)
        .then(() => {
            return agent
            .put('/trips/34')
            .send({country: undefined, city: 'Romecheck', start_date: '2023-05-01', end_date: '2023-05-09', emails: ['nirHALAY@gmail.com']})
            .expect(400)
            .then((response) => {
                expect(response.body).to.be.deep.equal({msg: 'All fields should be specified'});
            });
        })
    });

    it('PUT /trips/:trip_id should NOT update a specific trip - dates not in correct format', function () {
        const agent = request.agent(app);
        return agent
        .post('/login')
        .send({username: 'inbalG@gmail.com', password: 'inbalGHY'}) // User exist
        .redirects(1)
        .then(() => {
            return agent
            .put('/trips/34')
            .send({country: 'Italcheck', city: 'Romecheck', start_date: '2023-35-01', end_date: '2023-05-09', emails: ['nirHALAY@gmail.com']})
            .expect(400)
            .then((response) => {
                expect(response.body).to.be.deep.equal({msg: 'invalid date format'});
            });
        })
    });

    it('PUT /trips/:trip_id should NOT update a specific trip - trip not created yet- wrong id', function () {
        const agent = request.agent(app);
        return agent
        .post('/login')
        .send({username: 'inbalG@gmail.com', password: 'inbalGHY'}) // User exist
        .redirects(1)
        .then(() => {
            return agent
            .put('/trips/19')
            .send({country: 'Italcheck', city: 'Romecheck', start_date: '2023-05-01', end_date: '2023-05-09', emails: ['nirHALAY@gmail.com']})
            .expect(400)
            .then((response) => {
                expect(response.body).to.be.deep.equal({msg: 'invalid trip id'});
            });
        })
    });

    it('PUT /trips/:trip_id should NOT update a specific trip - trip not created yet- Unauthorized', function () {
        const agent = request.agent(app);
        return agent
        .post('/login')
        .send({username: 'inbalG@gmail.com', password: 'inbalGHY'}) // User exist
        .redirects(1)
        .then(() => {
            return agent
            .put('/trips/1')
            .send({country: 'Italcheck', city: 'Romecheck', start_date: '2023-05-01', end_date: '2023-05-09', emails: ['nirHALAY@gmail.com']})
            .expect(400)
            .then((response) => {
                expect(response.body).to.be.deep.equal({msg: 'Unauthorized'});
            });
        })
    });

    it('PUT /trips/:trip_id should update a specific trip', function () {
        const agent = request.agent(app);
        return agent
        .post('/login')
        .send({username: 'inbalG@gmail.com', password: 'inbalGHY'}) // User exist
        .redirects(1)
        .then(() => {
            return agent
            .put('/trips/34')
            .send({country: 'Italcheck', city: 'Romecheck', start_date: '2023-07-01', end_date: '2023-07-09', emails: ['nirHALAY@gmail.com']})
            .expect(200)
            .then((response) => {
                expect(response.body).to.have.ownProperty('id');
                expect(response.body).to.have.ownProperty('country');
                expect(response.body).to.have.ownProperty('city');
                expect(response.body).to.have.ownProperty('start_date');
                expect(response.body).to.have.ownProperty('end_date');
                expect(response.body).to.have.ownProperty('created_by');
            });
        })
    });

    it('DELETE /trips/:trip_id should NOT delete a specific trip- wrong id', function () {
        const agent = request.agent(app);
        return agent
        .post('/login')
        .send({username: 'inbalG@gmail.com', password: 'inbalGHY'}) // User exist
        .redirects(1)
        .then(() => {
            return agent
            .delete('/trips/19')
            .expect(400)
            .then((response) => {
                expect(response.body).to.be.deep.equal({msg: 'invalid trip id'});
            });
        })
    });

    it('DELETE /trips/:trip_id should NOT delete a specific trip- Unauthorized', function () {
        const agent = request.agent(app);
        return agent
        .post('/login')
        .send({username: 'inbalG@gmail.com', password: 'inbalGHY'}) // User exist
        .redirects(1)
        .then(() => {
            return agent
            .delete('/trips/1')
            .expect(400)
            .then((response) => {
                expect(response.body).to.be.deep.equal({msg: 'Unauthorized'});
            });
        })
    });

    it('DELETE /trips/:trip_id should delete a specific trip', function () { // works- deleting trips from db
        const agent = request.agent(app);
        return agent
        .post('/login')
        .send({username: 'inbalG@gmail.com', password: 'inbalGHY'}) // User exist
        .redirects(1)
        .then(() => {
            return agent
            .delete('/trips/30')
            .expect(200)
            .then((response) => {
                expect(response.body).to.be.deep.equal({msg: 'Deleted trip'});
            });
        })
    });
});


// Activity
describe('/activities routes', function () {
    it('POST /trips/:trip_id/activities should NOT post a new activity- needs fields specified', function () {
        const agent = request.agent(app);
        return agent
        .post('/login')
        .send({username: 'inbalG@gmail.com', password: 'inbalGHY'}) // User exist
        .redirects(1)
        .then(() => {
            return agent
            .post('/trips/34/activities')
            .send({date: undefined, activity_name: 'just check', address: 'nowhere', url: 'www', start_time: '10:00', end_time: '12:00', user_notes: undefined})
            .expect(400)
            .then((response) => {
                expect(response.body).to.be.deep.equal({msg: 'Date, activity_name, start_time and end_time must be specified'});
            });
        })
    });

    it('POST /trips/:trip_id/activities should NOT post a new activity- start_time or end_time not correct', function () {
        const agent = request.agent(app);
        return agent
        .post('/login')
        .send({username: 'inbalG@gmail.com', password: 'inbalGHY'}) // User exist
        .redirects(1)
        .then(() => {
            return agent
            .post('/trips/34/activities')
            .send({date: '2023-06-09', activity_name: 'just check', address: 'nowhere', url: 'www', start_time: '111:00', end_time: '12:00', user_notes: undefined})
            .expect(400)
            .then((response) => {
                expect(response.body).to.be.deep.equal({msg: 'The start time and end time must be in the correct format'});
            });
        })
    });

    it('POST /trips/:trip_id/activities should NOT post a new activity- date not correct', function () {
        const agent = request.agent(app);
        return agent
        .post('/login')
        .send({username: 'inbalG@gmail.com', password: 'inbalGHY'}) // User exist
        .redirects(1)
        .then(() => {
            return agent
            .post('/trips/34/activities')
            .send({date: '2023-26-09', activity_name: 'just check', address: 'nowhere', url: 'www', start_time: '11:00', end_time: '12:00', user_notes: undefined})
            .expect(400)
            .then((response) => {
                expect(response.body).to.be.deep.equal({msg: 'The date must be in the correct format'});
            });
        })
    });

    it('POST /trips/:trip_id/activities should insert a new activity', function () {   
        const agent = request.agent(app);
        return agent
        .post('/login')
        .send({username: 'inbalG@gmail.com', password: 'inbalGHY'}) // User exist
        .redirects(1)
        .then(() => {
            return agent
            .post('/trips/34/activities')
            .send({date: '2023-06-09', activity_name: 'just check', address: 'nowhere', url: 'www', start_time: '11:00', end_time: '12:00', user_notes: 'check'})
            .expect(200)
            .then((response) => {
                expect(response.body).to.have.ownProperty('id');
                expect(response.body).to.have.ownProperty('date');
                expect(response.body).to.have.ownProperty('trip_id');
                expect(response.body).to.have.ownProperty('activity_name');
                expect(response.body).to.have.ownProperty('address');
                expect(response.body).to.have.ownProperty('url');
                expect(response.body).to.have.ownProperty('start_time');
                expect(response.body).to.have.ownProperty('end_time');
                expect(response.body).to.have.ownProperty('user_id');
                expect(response.body).to.have.ownProperty('user_notes');
            });
        })
    });

    it('GET /trips/:trip_id/activities should NOT return an array of trip activities - wrong trip_id', function () {
        const agent = request.agent(app);
        return agent
        .post('/login')
        .send({username: 'inbalG@gmail.com', password: 'inbalGHY'}) // User exist
        .redirects(1)
        .then(() => {
            return agent
            .get('/trips/39/activities')
            .expect(400)
            .then((response) => {
                expect(response.body).to.be.deep.equal({msg: 'invalid trip id'});
            });
        })
    });
    
    it('GET /trips/:trip_id/activities returns an array of trip activities', function () {
        const agent = request.agent(app);
        return agent
        .post('/login')
        .send({username: 'inbalG@gmail.com', password: 'inbalGHY'}) // User exist
        .redirects(1)
        .then(() => {
            return agent
            .get('/trips/34/activities')  
        })
        .then((response) => {
            expect(response.body).to.be.an.instanceOf(Array);
        })
    });

    it('GET /trips/:trip_id/activities returns an array of all trips activities', function () {
        const agent = request.agent(app);
        return agent
        .post('/login')
        .send({username: 'inbalG@gmail.com', password: 'inbalGHY'}) // User exist
        .redirects(1)
        .then(() => {
            return agent
            .get('/trips/34/activities')
            .expect(200)
            .then(async (response) => {
                const results = await pool.query('select * from activities where trip_id =34');
                expect(response.body.length).to.be.equal(results.rows.length);
                response.body.forEach((activity) => {
                    expect(activity).to.have.ownProperty('id');
                    expect(activity).to.have.ownProperty('date');
                    expect(activity).to.have.ownProperty('trip_id');
                    expect(activity).to.have.ownProperty('activity_name');
                    expect(activity).to.have.ownProperty('address');
                    expect(activity).to.have.ownProperty('url');
                    expect(activity).to.have.ownProperty('start_time');
                    expect(activity).to.have.ownProperty('end_time');
                    expect(activity).to.have.ownProperty('user_id');
                    expect(activity).to.have.ownProperty('user_notes');
                });
            });
        })
    });

    it('GET /trips/:trip_id/activities/:activity_id should NOT return a specific activity for a specific trip - id not created', function () {
        const agent = request.agent(app);
        return agent
        .post('/login')
        .send({username: 'inbalG@gmail.com', password: 'inbalGHY'}) // User exist
        .redirects(1)
        .then(() => {
            return agent
            .get('/trips/20/activities/3')
            .expect(400)
            .then((response) => {
                expect(response.body).to.be.deep.equal({msg: 'invalid trip id'});
            });
        })
    });

    it('GET /trips/:trip_id/activities/:activity_id should return a specific activity for a specific trip', function () {
        const agent = request.agent(app);
        return agent
        .post('/login')
        .send({username: 'inbalG@gmail.com', password: 'inbalGHY'}) // User exist
        .redirects(1)
        .then(() => {
            return agent
            .get('/trips/32/activities/8')
            .expect(200)
            .then((response) => {
                expect(response.body).to.have.ownProperty('id');
                expect(response.body).to.have.ownProperty('date');
                expect(response.body).to.have.ownProperty('trip_id');
                expect(response.body).to.have.ownProperty('activity_name');
                expect(response.body).to.have.ownProperty('url');
                expect(response.body).to.have.ownProperty('start_time');
                expect(response.body).to.have.ownProperty('end_time');
                expect(response.body).to.have.ownProperty('user_id');
                expect(response.body).to.have.ownProperty('user_notes');
            });
        })
    });

    it('PUT /trips/:trip_id/activities/:activity_id should NOT update an activity- needs fields specified', function () {
        const agent = request.agent(app);
        return agent
        .post('/login')
        .send({username: 'inbalG@gmail.com', password: 'inbalGHY'}) // User exist
        .redirects(1)
        .then(() => {
            return agent
            .put('/trips/32/activities/8')
            .send({date: undefined, activity_name: 'just check', address: 'nowhere', url: 'www', start_time: '10:00', end_time: '12:00', user_notes: undefined})
            .expect(400)
            .then((response) => {
                expect(response.body).to.be.deep.equal({msg: 'Date, activity_name, start_time and end_time must be specified'});
            });
        })
    });

    it('PUT /trips/:trip_id/activities/:activity_id should NOT update an activity- start_time or end_time not correct', function () {
        const agent = request.agent(app);
        return agent
        .post('/login')
        .send({username: 'inbalG@gmail.com', password: 'inbalGHY'}) // User exist
        .redirects(1)
        .then(() => {
            return agent
            .put('/trips/32/activities/8')
            .send({date: '2023-06-09', activity_name: 'just check', address: 'nowhere', url: 'www', start_time: '111:00', end_time: '12:00', user_notes: undefined})
            .expect(400)
            .then((response) => {
                expect(response.body).to.be.deep.equal({msg: 'The start time and end time must be in the correct format'});
            });
        })
    });

    it('PUT /trips/:trip_id/activities/:activity_id should NOT update an activity- date not correct', function () {
        const agent = request.agent(app);
        return agent
        .post('/login')
        .send({username: 'inbalG@gmail.com', password: 'inbalGHY'}) // User exist
        .redirects(1)
        .then(() => {
            return agent
            .put('/trips/32/activities/8')
            .send({date: '2023-26-09', activity_name: 'just check', address: 'nowhere', url: 'www', start_time: '11:00', end_time: '12:00', user_notes: undefined})
            .expect(400)
            .then((response) => {
                expect(response.body).to.be.deep.equal({msg: 'The date must be in the correct format'});
            });
        })
    });

    it('PUT /trips/:trip_id/activities/:activity_id should update an activity', function () {   // works- inserting a new activity
        const agent = request.agent(app);
        return agent
        .post('/login')
        .send({username: 'inbalG@gmail.com', password: 'inbalGHY'}) // User exist
        .redirects(1)
        .then(() => {
            return agent
            .put('/trips/32/activities/8')
            .send({date: '2023-06-09', activity_name: 'just check', address: 'nowhere', url: 'www', start_time: '11:00', end_time: '12:00', user_notes: 'check'})
            .expect(200)
            .then((response) => {
                expect(response.body).to.have.ownProperty('id');
                expect(response.body).to.have.ownProperty('date');
                expect(response.body).to.have.ownProperty('trip_id');
                expect(response.body).to.have.ownProperty('activity_name');
                expect(response.body).to.have.ownProperty('address');
                expect(response.body).to.have.ownProperty('url');
                expect(response.body).to.have.ownProperty('start_time');
                expect(response.body).to.have.ownProperty('end_time');
                expect(response.body).to.have.ownProperty('user_id');
                expect(response.body).to.have.ownProperty('user_notes');
            });
        })
    });

    it('DELETE /trips/:trip_id/activities/:activity_id should NOT delete a specific activity- wrong id', function () {
        const agent = request.agent(app);
        return agent
        .post('/login')
        .send({username: 'inbalG@gmail.com', password: 'inbalGHY'}) // User exist
        .redirects(1)
        .then(() => {
            return agent
            .delete('/trips/34/activities/18')
            .expect(400)
            .then((response) => {
                expect(response.body).to.be.deep.equal({msg: 'invalid id'});
            });
        })
    });

    it('DELETE /trips/:trip_id/activities/:activity_id should delete a specific trip', function () {  // works- deleting activity
        const agent = request.agent(app);
        return agent
        .post('/login')
        .send({username: 'inbalG@gmail.com', password: 'inbalGHY'}) // User exist
        .redirects(1)
        .then(() => {
            return agent
            .delete('/trips/34/activities/11')
            .expect(200)
            .then((response) => {
                expect(response.body).to.be.deep.equal({msg: 'Deleted activity'});
            });
        })
    });
});


// Comment
describe('/comments routes', function () {
    it('GET /trips/:trip_id/activities/:activity_id/comments should NOT return an array of trip activities comments - wrong activity_id', function () {
        const agent = request.agent(app);
        return agent
        .post('/login')
        .send({username: 'inbalG@gmail.com', password: 'inbalGHY'}) // User exist
        .redirects(1)
        .then(() => {
            return agent
            .get('/trips/32/activities/18/comments')
            .expect(400)
            .then((response) => {
                expect(response.body).to.be.deep.equal({msg: 'invalid id'});
            });
        })
    });
    
    it('GET /trips/:trip_id/activities/:activity_id/comments returns an array of trip activities comments', function () {
        const agent = request.agent(app);
        return agent
        .post('/login')
        .send({username: 'inbalG@gmail.com', password: 'inbalGHY'}) // User exist
        .redirects(1)
        .then(() => {
            return agent
            .get('/trips/32/activities/8/comments')  
        })
        .then((response) => {
            expect(response.body).to.be.an.instanceOf(Array);
        })
    });

    it('GET /trips/:trip_id/activities/:activity_id/comments returns an array of trip activities comments', function () {
        const agent = request.agent(app);
        return agent
        .post('/login')
        .send({username: 'inbalG@gmail.com', password: 'inbalGHY'}) // User exist
        .redirects(1)
        .then(() => {
            return agent
            .get('/trips/32/activities/8/comments')
            .expect(200)
            .then(async (response) => {
                const results = await pool.query('select * from activity_comments where activity_id = 8');
                expect(response.body.length).to.be.equal(results.rows.length);
                response.body.forEach((comment) => {
                    expect(comment).to.have.ownProperty('id');
                    expect(comment).to.have.ownProperty('activity_id');
                    expect(comment).to.have.ownProperty('user_id');
                    expect(comment).to.have.ownProperty('comment');
                    expect(comment).to.have.ownProperty('timestamp');
                });
            });
        })
    });

    it('POST /trips/:trip_id/activities/:activity_id/comments should NOT post a new comment- needs comment specified', function () {
        const agent = request.agent(app);
        return agent
        .post('/login')
        .send({username: 'inbalG@gmail.com', password: 'inbalGHY'}) // User exist
        .redirects(1)
        .then(() => {
            return agent
            .post('/trips/32/activities/9/comments')
            .send({comment: undefined})
            .expect(400)
            .then((response) => {
                expect(response.body).to.be.deep.equal({msg: 'Needs comment text to publish'});
            });
        })
    });

    it('POST /trips/:trip_id/activities/:activity_id/comments should NOT post a new comment- wrong id', function () {
        const agent = request.agent(app);
        return agent
        .post('/login')
        .send({username: 'inbalG@gmail.com', password: 'inbalGHY'}) // User exist
        .redirects(1)
        .then(() => {
            return agent
            .post('/trips/110/activities/1/comments')
            .send({comment: 'checky check'})
            .expect(400)
            .then((response) => {
                expect(response.body).to.be.deep.equal({msg: 'invalid trip id'});
            });
        })
    });

    it('POST /trips/:trip_id/activities/:activity_id/comments should insert a new comment', function () {   // works- inserting a new activity
        const agent = request.agent(app);
        return agent
        .post('/login')
        .send({username: 'inbalG@gmail.com', password: 'inbalGHY'}) // User exist
        .redirects(1)
        .then(() => {
            return agent
            .post('/trips/32/activities/9/comments')
            .send({comment: 'checky check'})
            .expect(200)
            .then((response) => {
                expect(response.body).to.have.ownProperty('id');
                expect(response.body).to.have.ownProperty('activity_id');
                expect(response.body).to.have.ownProperty('user_id');
                expect(response.body).to.have.ownProperty('comment');
                expect(response.body).to.have.ownProperty('timestamp');
            });
        })
    });

    it('PUT /trips/:trip_id/activities/:activity_id/comments/:comment_id should NOT update a new comment- needs comment specified', function () {
        const agent = request.agent(app);
        return agent
        .post('/login')
        .send({username: 'inbalG@gmail.com', password: 'inbalGHY'}) // User exist
        .redirects(1)
        .then(() => {
            return agent
            .put('/trips/32/activities/8/comments/6')
            .send({comment: undefined})
            .expect(400)
            .then((response) => {
                expect(response.body).to.be.deep.equal({msg: 'Needs comment text to publish'});
            });
        })
    });

    it('PUT /trips/:trip_id/activities/:activity_id/comments/:comment_id should NOT update a new comment- wrong id', function () {
        const agent = request.agent(app);
        return agent
        .post('/login')
        .send({username: 'inbalG@gmail.com', password: 'inbalGHY'}) // User exist
        .redirects(1)
        .then(() => {
            return agent
            .put('/trips/332/activities/8/comments/6')
            .send({comment: 'checky check'})
            .expect(400)
            .then((response) => {
                expect(response.body).to.be.deep.equal({msg: 'invalid trip id'});
            });
        })
    });

    it('PUT /trips/:trip_id/activities/:activity_id/comments/:comment_id should update a new comment', function () {   // works- inserting a new activity
        const agent = request.agent(app);
        return agent
        .post('/login')
        .send({username: 'inbalG@gmail.com', password: 'inbalGHY'}) // User exist
        .redirects(1)
        .then(() => {
            return agent
            .put('/trips/32/activities/8/comments/6')
            .send({comment: 'checky check 5555'})
            .expect(200)
            .then((response) => {
                expect(response.body).to.have.ownProperty('id');
                expect(response.body).to.have.ownProperty('activity_id');
                expect(response.body).to.have.ownProperty('user_id');
                expect(response.body).to.have.ownProperty('comment');
                expect(response.body).to.have.ownProperty('timestamp');
            });
        })
    });

    it('DELETE /trips/:trip_id/activities/:activity_id/comments/:comment_id should NOT delete a specific comment- wrong id', function () {
        const agent = request.agent(app);
        return agent
        .post('/login')
        .send({username: 'inbalG@gmail.com', password: 'inbalGHY'}) // User exist
        .redirects(1)
        .then(() => {
            return agent
            .delete('/trips/332/activities/8/comments/6')
            .expect(400)
            .then((response) => {
                expect(response.body).to.be.deep.equal({msg: 'invalid trip id'});
            });
        })
    });

    it('DELETE /trips/:trip_id/activities/:activity_id/comments/:comment_id should delete a specific comment', function () {  // works- deleting activity
        const agent = request.agent(app);
        return agent
        .post('/login')
        .send({username: 'inbalG@gmail.com', password: 'inbalGHY'}) // User exist
        .redirects(1)
        .then(() => {
            return agent
            .delete('/trips/32/activities/8/comments/6')
            .expect(200)
            .then((response) => {
                expect(response.body).to.be.deep.equal({msg: 'Deleted comment'});
            });
        })
    });
});



// Routes tests - without login
describe('/trips routes', function () {
    describe('GET /trips', function () {
        it('should NOT return an array of trips', function () {
            const agent = request.agent(app);
            return agent
                .get('/trips')
                .expect(401)
                .then((response) => {
                    expect(response.body).to.be.deep.equal({ msg: 'You need to login first' });
                });
        });
    });

    describe('GET /trips/:trip_id/activities', function () {
        it('GET /trips/:trip_id/activities should NOT return an array of trip activities', function () {
            const agent = request.agent(app);
            return agent
                .get('/trips/2/activities')
                .expect(401)
                .then((response) => {
                    expect(response.body).to.be.deep.equal({ msg: 'You need to login first' });
                });
        });
    });
});