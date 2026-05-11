const express = require('express');
const path = require('path');
const port = 9000;
const app = express();

const connectDB = require('./config/db');

const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('./config/passport-config');

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(session({
    secret: 'dynex-secret',
    resave: true,
    saveUninitialized: true,
    cookie: { 
        secure: false, 
        maxAge: 1000 * 60 * 60 * 24 
    }
}));
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
});

connectDB();

app.use(express.static(path.join(__dirname, 'public')));

const adminRoutes = require('./routes/admin-routes');

app.use('/', adminRoutes);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
