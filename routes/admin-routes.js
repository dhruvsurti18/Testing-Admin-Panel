const express = require('express');
const router = express.Router();
const multer = require('multer');
const adminController = require('../controllers/admin-controller');
const passport = require('passport');

const checkAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

router.get('/login', adminController.loginPage);

router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) { return next(err); }
        if (!user) { return res.redirect('/login'); }
        req.logIn(user, (err) => {
            if (err) { return next(err); }
            return res.redirect('/');
        });
    })(req, res, next);
});

router.get('/register', adminController.registerPage);

router.post('/register', adminController.registerUser);

router.get('/logout', adminController.logoutUser);

router.get('/', checkAuth, adminController.adminHome);

router.get('/add-user', checkAuth, adminController.adminAddUser);

router.get('/view-user', checkAuth, adminController.adminViewUser);

router.post('/add-user', checkAuth, upload.single('avatar'), adminController.adminAddUser);

router.get('/delete-user/:id', checkAuth, adminController.deleteUser);

router.get('/edit-user/:id', checkAuth, adminController.editUser);

router.post('/update-user/:id', checkAuth, upload.single('avatar'), adminController.updateUser);

module.exports = router;