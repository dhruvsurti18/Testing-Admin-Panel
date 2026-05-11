const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/admin-model');

passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
        console.log("Identifier:", email);
        const user = await User.findOne({ 
            $or: [{ email: email }, { fname: email }] 
        });

        if (!user) {
            return done(null, false, { message: 'Incorrect email or username.' });
        }
        
        if (user.password != password) {
            return done(null, false, { message: 'Incorrect password.' });
        }
        
        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        if (!user) {
            console.log("Deserialization failed: User not found with id", id);
        }
        done(null, user);
    } catch (err) {
        console.log("Deserialization error:", err);
        done(err);
    }
});

module.exports = passport;
