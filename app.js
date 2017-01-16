// ----- modules
var express = require('express')
var app = express()
var path = require('path')
var request = require('sync-request')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// ----- intializing body parser 
app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({limit: '5mb'}));
var port = process.env.PORT || 3000

Photo = require('./models/photo');

// Connect to Mongoose
mongoose.connect('mongodb://localhost/albums');
var db = mongoose.connection;

// ----- public variables
var code
var access_token
var fields
var photos
// ----- config
var FBConfig = require('./config').facebook

// ----- where the server start
app.listen(port, function () {
  console.log('Example app listening on port ' + port + '!')
})
// ----- home page "localhost:3000"
app.get('/', function (req, res, next) {
  res.sendFile(path.join(__dirname + '/templates/index.html'))
  // res.send('Welcome !'+req.get('host'))
})
// ----- page that call for login
app.get('/go', function (req, res) {
  req.method = 'get'
  res.redirect('https://www.facebook.com/v2.8/dialog/oauth?client_id=' + FBConfig.clientID + '&redirect_uri=' + FBConfig.redirectURL)
})
// ----- a function that generate access token
function getToken () {
  var fullURL = 'https://graph.facebook.com/oauth/access_token?client_id=' + FBConfig.clientID + '&redirect_uri=' + FBConfig.redirectURL + '&client_secret=' + FBConfig.cientSecret + '&code=' + code
  var res = request('GET', fullURL)
  access_token = (((res.getBody()).toString()).match('access_token=(.*)&'))[1] + ''
}
// ----- Behold! The Magic! here we populate our variable "fields"  with data
app.get('/albums', function (req, res) {
  code = req.query.code
  getToken()
  var resp = request('GET', 'https://graph.facebook.com/v2.8/me?fields=' + FBConfig.scope + '&access_token=' + access_token)
  var resPhoto = request('GET', 'https://graph.facebook.com/v2.8/me?fields=albums.fields(photos.fields(source))&access_token=' + access_token)
  fields = JSON.parse((resp.body).toString())
  photos = JSON.parse((resPhoto.body).toString())
  res.redirect('http://localhost:3000/redirect')
})
// ----- app page,,, do what ever you want here
app.get('/redirect', function (req, res, next) {
  res.sendFile(path.join(__dirname + '/templates/app.html'))
})
// ----- calling for routes
app.get('/main', function (req, res, next) {
  res.sendFile(path.join(__dirname + '/templates/routes/main.htm'))
})
app.get('/album', function (req, res, next) {
  res.sendFile(path.join(__dirname + '/templates/routes/album.htm'))
})
// ----- CROSS
app.get('/app', function (req, res, next) {
  var arr = [fields, photos]
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'X-Requested-With')
  res.send(arr)
  next()
})
// ----- Our RESTfull api is resting in peace here
app.post('/api/albums', (req, res) => {
	var photo = req.body;
	Photo.addPhoto(photo, (err, photo) => {
  if (err) {
    throw err;
  }
  res.json(photo);
	});
});

app.get('/api/albums/:_id', (req, res) => {
	Photo.getPhotoById(req.params._id, (err, Photo) => {
		if(err){
			throw err;
		}
		res.json(Photo);
	});
});

app.get('/api/albums', (req, res) => {
	Photo.getPhoto((err, photo) => {
		if(err){
			throw err;
		}
		res.json(photo);
	});
});

app.delete('/api/albums/:_id', (req, res) => {
	var id = req.params._id;
	Photo.removePhoto(id, (err, photo) => {
		if(err){
			throw err;
		}
		res.json(photo);
	});
});
