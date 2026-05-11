const User = require('../models/admin-model');

exports.adminHome = async (req, res) => {
     try {
          res.render('home');
     } catch (err) {
          console.log(err);
     }
};

exports.loginPage = (req, res) => {
     res.render('login');
};

exports.loginUser = async (req, res) => {
     res.redirect('/');
};

exports.registerPage = (req, res) => {
     res.render('register');
};

exports.registerUser = async (req, res) => {
     try {
          const { username, email, password } = req.body;
          const newUser = new User({
               fname: username,
               lname: 'User',
               email,
               password,
               phone: '0000000000',
               dob: '2000-01-01',
               role: 'Admin',
               city: 'Unknown',
               gender: 'Other'
          });
          await newUser.save();
          res.redirect('/login');
     } catch (err) {
          console.log(err);
          res.redirect('/register');
     }
};

exports.logoutUser = (req, res) => {
     req.session = null;
     res.clearCookie('connect.sid');
     res.redirect('/login');
};

exports.adminAddUser = async (req, res) => {
     if (req.method === 'POST') {
          try {
               const { fname, lname, email, password, phone, dob, role, city, gender } = req.body;
               const avatar = req.file ? '/uploads/' + req.file.filename : '';
               const newUser = new User({ fname, lname, email, password, phone, dob, role, city, gender, avatar });
               await newUser.save();
               res.redirect('/view-user');
          } catch (err) {
               console.log(err);
          }
     } else {
          res.render('addUser');
     }
};

exports.adminViewUser = async (req, res) => {
     try {
          const users = await User.find();
          res.render('viewUser', { users });
     } catch (err) {
          console.log(err);
     }
};

exports.deleteUser = async (req, res) => {
     try {
          const id = req.params.id;
          await User.findByIdAndDelete(id);
          res.redirect('/view-user');
     } catch (err) {
          console.log(err);
     }
};

exports.editUser = async (req, res) => {
     try {
          const id = req.params.id;
          const user = await User.findById(id);
          res.render('editUser', { user });
     } catch (err) {
          console.log(err);
     }
};

exports.updateUser = async (req, res) => {
     try {
          const id = req.params.id;
          const { fname, lname, email, password, phone, dob, role, city, gender } = req.body;

          let updateData = {
               fname, lname, email, password, phone, dob, role, city, gender
          };

          if (req.file) {
               updateData.avatar = '/uploads/' + req.file.filename;
          }

          await User.findByIdAndUpdate(id, updateData);
          res.redirect('/view-user');
     } catch (err) {
          console.log(err);
     }
};