const express = require('express');
const apiRouter = express.Router();
const {query} = require('./db');

// Get all trips-
apiRouter.get ('/trips', (req, res, next) => {
    query('select * from trips', (error, results) => {
        if (error) {
            return res.status(500);
        }
        res.status(200).json(results.rows);
      })
});



module.exports = apiRouter;