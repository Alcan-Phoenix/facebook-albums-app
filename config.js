// Facebook app config for tests, dont forget to add "%2C" as "," in scopes" 
module.exports = {
  facebook: {
    clientID: 'client ID',
    cientSecret: 'APP ID',
    scope:      'id,name,albums,picture',
    redirectURL: 'http%3A%2F%2Flocalhost:3000/albums'
  }
};
