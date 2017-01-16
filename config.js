// Facebook app config for tests, dont forget to add "%2C" as "," in scopes" 
module.exports = {
  facebook: {
    clientID: '1727046497612455',
    cientSecret: '532742e23ca0d52b868f1f562d040ec5',
    scope:      'id,name,albums,picture',
    redirectURL: 'http%3A%2F%2Flocalhost:3000/albums'
  }
};