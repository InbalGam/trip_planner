const express = require('express');
const tripsRouter = express.Router();
const {query} = require('./db');


tripsRouter.use((req, res, next) => {
    if (!req.user) {
        return res.status(401).json({msg: 'You need to login first'});
    }
    next();
});


// Get all trips-
tripsRouter.get('/trips', (req, res, next) => {
    query('select * from trips', (error, results) => {
        if (error) {
            return res.status(500);
        }
        res.status(200).json(results.rows);
      });
});



module.exports = tripsRouter;