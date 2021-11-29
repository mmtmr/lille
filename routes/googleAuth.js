const router = require("express").Router();
const { google } = require('googleapis');
const authorize = require("../middleware/authorize");
const authorizeGoogle = require("../middleware/authorizeGoogle");
const path = require('path');

/*  PASSPORT SETUP  */

const passport = require('passport');
// var userProfile;
router.use(passport.initialize());
router.use(passport.session());

router.get('/success', (req, res) => res.send('success google authorisation'));
router.get('/error', (req, res) => res.send("error logging in"));
// router.get('/login', function (req, res) {
//   try { res.render('googleAuth'); console.log(req) } catch (error) { console.error(error); }
// });
passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});

/*  Google AUTH  */

const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
require("dotenv").config();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback"
},
  function (accessToken, refreshToken, profile, done) {
    userProfile = profile;
    return done(null, { userProfile: profile, accessToken: accessToken, refreshToken: refreshToken });
  }
));

router.get('/',
  passport.authenticate('google', { scope: ['email', 'profile', 'https://www.googleapis.com/auth/calendar.events'], accessType: 'offline', approvalPrompt: 'force' }));

router.get('/callback',
  passport.authenticate('google', { scope: ['email', 'profile', 'https://www.googleapis.com/auth/calendar.events'], successRedirect: '/', failureRedirect: 'error' }),
  function (req, res) {
    res.redirect('/')
  });

router.get('/verify', authorizeGoogle, function (req, res) { if (!req.user) res.sendStatus(401); else res.sendStatus(200); })

router.post('/event',
  authorizeGoogle,
  function (req, res) {
    /**
     * Create a new OAuth2 client
     */
    try {
      const oAuth2Client = new google.auth.OAuth2(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        '/auth/google/callback');

      oAuth2Client.credentials = {
        access_token: req.user.accessToken,
        refresh_token: req.user.refreshToken,
      };
      const { event } = req.body;
      const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });
      calendar.events.insert({
        auth: oAuth2Client,
        calendarId: 'primary',
        resource: event,
      }, function (err, event) {
        if (err) {
          console.log('There was an error contacting the Calendar service: ' + err);
          console.log(event)
          res.sendStatus(401);
          return;
        }
        else {
          res.sendStatus(200);
        }
      }
      )
    } catch (err) { console.log('Authorisation error'); res.sendStatus(401); }

  }
)
module.exports = router;