const expect = require('chai').expect;
const request = require('supertest');


// from somewhere else- should I delete?
const { assert } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);
//

const app = require('../server');
const PORT = process.env.PORT || 4001;

// Authorization tests

describe('Authorization tests', function() {
    it('should pass auth check', async function() {
        const agent = chai.request.agent(`http://localhost:${PORT}`);

        try {
            await agent
              .post('/login')
              .send({ username: 'Srasda34', password: 'blufddddadadala23' });
            const authenticatedResponse = await agent.get('/login');
            assert.deepEqual(successResponse, workoutRes);
          } catch (e) {
            console.log(e);
          }
    });
});


// Routes tests

describe('/trips routes', function() {
    let fakeDb = require('../server/db.js');

    describe('GET /trips', function() {
        it('returns an array', function() {
        return request(app)
            .get('/trips')
            .expect(200)
            .then((response) => {
                expect(response.body).to.be.an.instanceOf(Array);
            });
        });

        it('returns an array of all trips', function() {
            return request(app)
                .get('/trips')
                .expect(200)
                .then((response) => {
                    let length = fakeDb.query('select * from trips').length;
                    expect(response.body.length).to.be.equal(length);
                    response.body.forEach((trip) => {
                        expect(trip).to.have.ownProperty('id');
                        expect(trip).to.have.ownProperty('country');
                        expect(trip).to.have.ownProperty('city');
                        expect(trip).to.have.ownProperty('start_date');
                        expect(trip).to.have.ownProperty('end_date');
                    });
                });
        });
    });

});