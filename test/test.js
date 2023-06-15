const expect = require('chai').expect;
const request = require('supertest');

const app = require('../server');
const PORT = process.env.PORT || 4001;

// Authorization tests
describe('Login Authorization tests', function() {
    it('should pass auth check for log in', function() {
        const agent = request.agent(app);
        return agent
            .post('/login')
            .send({username: 'Srasda34', password: 'blufddddadadala23'}) // User exist
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
            .send({username: 'userCHECK', password: 'passwordCHECK'})
            .then((response) => {
                expect(response.body).to.be.deep.equal({msg: 'All fields should be specified'});
            });
    });

    it('should NOT pass- password length limitation', function() {
        const agent = request.agent(app);
        return agent
            .post('/register')
            .send({username: 'userCHECK', password: 'p23f', nickname: 'userNickname'})
            .then((response) => {
                expect(response.body).to.be.deep.equal({msg: 'Password needs to be at least 8 characters'});
            });
    });

    it('should NOT pass- username OR nickname already exist', function() {
        const agent = request.agent(app);
        return agent
            .post('/register')
            .send({username: 'Srasda34', password: 'passwordCHECK', nickname: 'userNickname'})
            .then((response) => {
                expect(response.body).to.be.deep.equal({msg: 'Username or Nickname already exist, choose differently'});
            });
    });

    // it('should pass- insert new user', function() {
    //     const agent = request.agent(app);
    //     return agent
    //         .post('/register')
    //         .send({username: 'userCHECK1', password: 'passwordCHECK', nickname: 'userNickname1'}) // currently no mock DB so needs changing for username & nickname
    //         .expect(201)
    //         .then((response) => {
    //             expect(response.body).to.be.deep.equal({msg: 'Success creating user'});
    //         });
    // });
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
describe('/trips routes', function () {
    //let fakeDb = require('../server/db.js');

    it('GET /trips returns an array of trips', function () {
        const agent = request.agent(app);
        return agent
        .post('/login')
        .send({username: 'Srasda34', password: 'blufddddadadala23'}) // User exist
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
        .send({username: 'Srasda34', password: 'blufddddadadala23'}) // User exist
        .redirects(1)
        .then(() => {
            return agent
            .get('/trips')
            .expect(200)
            .then((response) => {
                // let length = fakeDb.query('select * from trips').length;
                // expect(response.body.length).to.be.equal(length);
                response.body.forEach((trip) => {
                    expect(trip).to.have.ownProperty('id');
                    expect(trip).to.have.ownProperty('country');
                    expect(trip).to.have.ownProperty('city');
                    expect(trip).to.have.ownProperty('start_date');
                    expect(trip).to.have.ownProperty('end_date');
                });
            });
        })
    });

    it('POST /trips should NOT post a new trip- needs all fields specified', function () {
        const agent = request.agent(app);
        return agent
        .post('/login')
        .send({username: 'Srasda34', password: 'blufddddadadala23'}) // User exist
        .redirects(1)
        .then(() => {
            return agent
            .post('/trips')
            .send({country: undefined, city: 'Romecheck', start_date: '2023-05-01', end_date: '2023-05-09'})
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
        .send({username: 'Srasda34', password: 'blufddddadadala23'}) // User exist
        .redirects(1)
        .then(() => {
            return agent
            .post('/trips')
            .send({country: 'ItalCheck', city: 'Romecheck', start_date: '2023-15-01', end_date: '2023-05-09'})
            .expect(400)
            .then((response) => {
                expect(response.body).to.be.deep.equal({msg: 'The start date and end date must be in the correct format'});
            });
        })
    });

    it('POST /trips should insert a new trip', function () {
        const agent = request.agent(app);
        return agent
        .post('/login')
        .send({username: 'Srasda34', password: 'blufddddadadala23'}) // User exist
        .redirects(1)
        .then(() => {
            return agent
            .post('/trips')
            .send({country: 'ItalCheck', city: 'Romecheck', start_date: '2023-05-01', end_date: '2023-05-09'})
            .expect(200)
            .then((response) => {
                expect(response.body).to.be.deep.equal({msg: 'Added trip'});
            });
        })
    });
});



// Routes tests - without login
describe('/trips routes', function() {
    describe('GET /trips', function() {
        it('should NOT return an array of trips', function() {
        const agent = request.agent(app);
        return agent
            .get('/trips')
            .expect(401)
            .then((response) => {
                expect(response.body).to.be.deep.equal({msg: 'You need to login first'});
            });
        });
    });
});