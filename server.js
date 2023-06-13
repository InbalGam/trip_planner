const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');

module.exports = app;

const PORT = process.env.PORT || 4001;

app.use(morgan('short'));
// middleware for handling CORS requests from index.html
app.use(cors());


// middware for parsing request bodies here:
app.use(bodyParser.json());


// Start your existing apiRouter below at the '/api' path.
const tripsRouter = require('./server/trips-api');
app.use('/', tripsRouter);

const authRouter = require('./server/auth-api');
app.use('/', authRouter);


// This conditional is here for testing purposes:
if (!module.parent) { 
  // start the server listening at PORT below:
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
}
