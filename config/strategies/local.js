'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	User = require('mongoose').model('User');

module.exports = function() {
	// Use local strategy
	passport.use(new LocalStrategy({
			usernameField: 'username',
			passwordField: 'password'
		},
		function(username, password, done) {
			User.findOne({
				username: username
			}, function(err, user) {
				if (err) {
					return done(err);
				}
				if (!user) {
					return done(null, false, {
						message: 'Unknown user or invalid password'
					});
				}
				//we made this async because of change from crypt to bcrypt
				user.authenticate(password, function(status) {
					console.log('status',status);
					if (!status) {
						console.log('statsssss?us');
						return done(null, false, {
							message: 'Unknown user or invalid password'
						});
					} else {
						return done(null, user);
					}
				});
			});
		}
	));
};