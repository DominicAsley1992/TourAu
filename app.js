// This app was writen by Team 48
// This has been made for GovHack 2013
// All code is creative commons license

// Setup node modules 
var express = require('express')
  , stylus = require('stylus')
  , nib = require('nib')
  , mysql = require('mysql')

var app = express()

// Setup Stylus templatomg engine
function compile(str, path) {
    return stylus(str)
      .set('filename', path)
      .use(nib())
}

// Set up express
app.set('views', __dirname + '/views')
app.set('view engine', 'jade')
app.use(express.logger('dev'))
app.use(stylus.middleware(
  {
      src: __dirname + '/public'
  , compile: compile
  }
))

// Set up public directory for app access
app.use(express.static(__dirname + '/public'))

// Set up routing for web access
app.get('/search', function (req, res) {
    var search = req.query.q
    res.render('search/search', { title: 'TEAM 48 - GOVHACK 2013', q: search})
    console.log(req.query.q)
})

app.get('/', function (req, res) {
    res.render('home/home', { title: 'TEAM 48 - GOVHACK 2013' })
})

// Start the app
app.listen(process.env.VMC_APP_PORT || 88)
console.log("site now running...")