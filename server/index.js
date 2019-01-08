// modules =================================================
const { Nuxt, Builder } = require('nuxt');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const path = require('path');
const cors = require('cors');
const compression = require('compression');

// routes ==================================================
const api = require('./routes');
const avatars = require('./app/avatars');

// configuration ===========================================
const config = require('./config');

// Print the current PID on the command line.
console.log("Process ID: " + process.pid);

// If the Node process ends, close things here
process.on('SIGINT', function() { });

// create the app
const app = express();

// get all data/stuff of the body (POST) parameters
app.use(cookieParser());
app.use(bodyParser.json()); // parse application/json 
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
app.use(cors());
app.use(compression());

app.use((req, res, next) => {
    res.header('Cache-Control', 'private, no-cache, must-revalidate');
    next();
});

app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT

// routes ==================================================
app.use('/api', api);
app.use('/avatars', avatars);

// error handling ==========================================
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({err: err.message});
});

// nuxt ====================================================
const nuxtConfig = require('../nuxt.config');
nuxtConfig.dev = !(process.env.NODE_ENV === 'production');

const nuxt = new Nuxt(nuxtConfig);

if(nuxtConfig.dev) {
    nuxtConfig.build.plugins = [new BundleAnalyzerPlugin()];
    const builder = new Builder(nuxt);
    builder.build();
}

app.use(nuxt.render);

// start app ===============================================
var port = process.env.PORT || config.http.port || 3000; // set our port
app.listen(port);
console.log('Magic happens on port ' + port); 			// shoutout to the user
exports = module.exports = app; 						// expose app