var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');

module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use('local-login', new LocalStrategy({
        usernameField : 'nick',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    function(req, nick, password, done) {
        if (nick)
            nick = nick.toLowerCase();

        process.nextTick(function() {
            User
            .findOne({ nick })
            .exec(function(err, user) {
                // if there are any errors, return the error
                if (err)
                    return done(err);

                // if no user is found, return the message
                if (!user)
                    return done(null, false);

                if (!user.validPassword(password))
                    return done(null, false);

                else
                    return done(null, user);
            });
        });

    }));

    passport.use('local-signup', new LocalStrategy({
        usernameField : 'nick',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, nick, password, done) {

        process.nextTick(function() {

        User.findOne({ 'nick' :  nick }, function(err, user) {

            if (err)
                return done(err);

            if (user) {
                return done(null, false);
            } else {

                var newUser = new User();
                newUser.nick = nick.toLowerCase();
                newUser.password = newUser.generateHash(password);

                newUser.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
            }

        });

        });

    }));

};
