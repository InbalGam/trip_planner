const express = require('express');
const authRouter = express.Router();
const {query} = require('./db');
const passport = require("passport");

// Registering a user
authRouter.post("/register", (req, res, next) => {
    const { username, password, nickname } = req.body;
    if (username === undefined || password === undefined || nickname === undefined) {
        return res.status(400).json({ msg: 'All fields should be specified' });
    };

    query('select * from users where username = $1 or nickname = $2;', [username, nickname],
        (error, results) => {
            if (error) {
                return res.status(500).json({ msg: 'Could not create user' });
            }
            if (results.rows.length > 0) {
                return res.status(400).json({ msg: 'Username or Nickname already exist, choose differently' });
            }

            query('insert into users (username, password, nickname) values ($1, $2, $3);', [username, password, nickname],
                (error, results) => {
                    if (error) {
                        return res.status(500).json({ msg: 'Could not create user' });
                    }
                    res.status(201).json({
                        msg: "Success creating user"
                    });
                });
        });
});


// Login a user
authRouter.get("/login", (req, res) => {
    res.status(401).json({msg: 'Authentication failed'});
});


authRouter.post("/login",
    passport.authenticate("local", { failureRedirect: "/login" }),
    (req, res) => {
      res.redirect("/trips");
    }
);


// Logout user
authRouter.get('/logout', function(req, res, next){
    req.logout(function(err) {
      if (err) { return next(err); }
      //res.redirect('/');
      res.status(200).json({msg: 'Successfully logged out'})
    });
});


module.exports = authRouter;