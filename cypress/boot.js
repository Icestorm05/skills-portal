const cypress = require('cypress');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { Nuxt, Builder } = require('nuxt');
const { promisify } = require('util');
const nuxtConfig = require('../nuxt.config');
const config = require('../server/config');

const app = express();
const api = require('../server/routes');
const nuxt = new Nuxt(nuxtConfig);
const port = process.env.PORT || config.http.port || 3000;

app.use(cookieParser());
app.use(bodyParser.json()); // parse application/json 
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded

// routes ==================================================
app.use('/api', api);

// error handling ==========================================
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({err: err.message});
});

nuxtConfig.dev = !(process.env.NODE_ENV === 'production');

if(nuxtConfig.dev) {
    (async() => {
        try {
            await new Builder(nuxt).build();
            await startTests();
        } catch(err) {
            process.exit();
        }
    })();
} else {
    startTests();
}

app.use(nuxt.render);
const server = app.listen(port);
console.log(`Listening on port ${port}`);
exports = module.exports = app;

async function startTests() {
    await cypress.run();
    server.close();
    process.exit();
}
