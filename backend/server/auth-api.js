const express = require('express');
const authRouter = express.Router();
const {pool} = require('./db');
const passport = require("passport");
const {passwordHash} = require('../hash');
const {validateEmail} = require('./utils');

// Registering a user
authRouter.post("/register", async (req, res) => {
    const { username, password, nickname } = req.body;
    if (!username || !password || !nickname ) {
        return res.status(400).json({ msg: 'All fields should be specified' });
    };

    if (password.length < 8) {
        return res.status(400).json({ msg: 'Password needs to be at least 8 characters' });
    }
    if (!validateEmail(username)) {
        return res.status(400).json({ msg: 'Username needs to be a valid email' });
    }

    if (nickname.length < 3) {
        return res.status(400).json({ msg: 'Nickname needs to be at least 3 characters' });
    }

    try {
        const check = await pool.query('select * from users where username = $1 or nickname = $2;', [username, nickname]);
        if (check.rows.length > 0) {
            return res.status(400).json({ msg: 'Username or Nickname already exist, choose differently' });
        }
        const hashedPassword = await passwordHash(password, 10);
        await pool.query('insert into users (username, password, nickname) values ($1, $2, $3);', [username, hashedPassword, nickname]);
        res.status(201).json({
            msg: "Success creating user"
        })
    } catch (e) {
        res.status(500).json({ msg: 'Could not create user' });
    }
});


// Login a user
authRouter.get("/login", (req, res) => {
    res.status(401).json({msg: 'Authentication failed'});
});


authRouter.post("/login",
    passport.authenticate("local"),
    (req, res) => {
        res.status(200).json({msg: 'Authentication succeeded'});
    }
);

// Login a user - using Google
authRouter.get('/login/google', passport.authenticate('google', {
    scope: ['email', 'profile']
}));


authRouter.get('/oauth2/redirect/google',
  passport.authenticate('google', { failureRedirect: `${process.env.CORS_ORIGIN}/login`, failureMessage: true }),
  (req, res) => {
    res.redirect(`${process.env.CORS_ORIGIN}/trips`);
});


// Logout user
authRouter.get('/logout', function(req, res, next){
    req.logout(function(err) {
      if (err) { return next(err); }
      res.status(200).json({msg: 'Successfully logged out'})
    });
});


module.exports = authRouter;