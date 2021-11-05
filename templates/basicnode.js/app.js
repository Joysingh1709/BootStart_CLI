/**
 * Module dependencies.
 */
const express = require('express');
const session = require('express-session');
const errorHandler = require('errorhandler');
const dotenv = require('dotenv');
const path = require('path');

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.config({ path: '.env.example' });

/**
 * Controllers (route handlers).
 */
const homeRouter = require('./router/home.router');

/**
 * API keys and Passport configuration.
 * for eg; const passportConfig = require('./config/passport');
 */



/**
 * Create Express server.
 */
const app = express();

/**
 * Connect to your Database service.
 */


/**
 * Express configuration.
 */
app.set('host', process.env.HOST_IP || '0.0.0.0');
app.set('port', process.env.PORT || 8080);
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET || 'use your secret key for session',
    cookie: { maxAge: 1209600000 }, // two weeks in milliseconds
}));

/**
 * Primary app routes.
 */
app.get('/', homeRouter);


/**
 * Error Handler.
 */
if (process.env.NODE_ENV === 'development') {
    // only use in development
    app.use(errorHandler());
} else {
    app.use((err, req, res, next) => {
        console.error(err);
        res.status(500).send('Server Error');
    });
}

/**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
    console.log('App is running at http://localhost:%d in %s mode ✓', app.get('port'), app.get('env'));
    console.log('  Press CTRL-C to stop\n');
});

module.exports = app;