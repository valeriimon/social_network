import passport from 'koa-passport';


passport.serializeUser((user, done) => {
  done(null, user._id)
})

passport.deserializeUser((id, done) => {
  User.findById(id).then(function(user){
    done(null, user?user.getClear():null);
  });
})

import User from '../models/User'

const LocalStrategy = require('passport-local').Strategy
passport.use(new LocalStrategy({usernameField: 'firstname',
    passwordField: 'password'}, async function(username, password, done) {
      let user = await User.findOne({firstname: username})
      if(user && user.comparePassword(password)) {
        done(null, user.getClear())
      } else {
        done(null, false)
      }
}))