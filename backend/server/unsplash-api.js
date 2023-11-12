const {createApi} = require('unsplash-js');

// on your node server
const unsplashServerApi = createApi({
  accessKey: process.env.UNSPLASH_KEY,
});

module.exports = {
    unsplashServerApi
};