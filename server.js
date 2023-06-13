const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const passport = require("passport");
const {query} = require('./server/db');
const session = require("express-session");
const LocalStrategy = require("passport-local").Strategy;
const store = new session.MemoryStore();
const bcrypt = require("bcrypt");

module.exports = app;

const PORT = process.env.PORT || 4001;

app.use(morgan('short'));
// middleware for handling CORS requests from index.html
app.use(cors());


// middleware for parsing request bodies here:
app.use(bodyParser.json());


// middlewares for authentication
app.use(
  session({
    secret: "f4z4gs$Gcg",
    cookie: { maxAge: 300000000, secure: false },
    saveUninitialized: false,
    resave: false,
    store,
  })
);


app.use(passport.initialize());
app.use(passport.session());


const comparePasswords = async (password, hash) => {
  try {
    const matchFound = await bcrypt.compare(password, hash);
    return matchFound;
  } catch (err) {
    console.log(err);
  }
  return false;
};

passport.use(
  new LocalStrategy(function (username, password, done) {
      query('select * from users where username = $1', [username], async (error, results) => {
          if (error) {
            return done(err);
          }
          if (results.rows.length === 0) {
            return done(null, false);
          }

          const passwordCheck = await comparePasswords(password, results.rows[0].password);
          if (!passwordCheck) {
            return done(null, false);
          }
          return done(null, results.rows[0]);
        });
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  query('select * from users where id = $1', [id], (error, results) => {
    if (error) {
      return done(err);
    }
    done(null, results.rows[0]);
  });
});



// Start auth router
const authRouter = require('./server/auth-api');
app.use('/', authRouter);

// Start app routers
const tripsRouter = require('./server/trips-api');
app.use('/', tripsRouter);


// This conditional is here for testing purposes:
if (!module.parent) { 
  // start the server listening at PORT below:
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
}
