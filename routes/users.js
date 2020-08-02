const express = require("express");
const router = express.Router();
const fs = require('fs');
const bcrypt = require("bcryptjs");
const passport = require("passport");
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser')
const app = express()
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
// Load User model
const User = require("../models/User");
const { forwardAuthenticated } = require("../config/auth");


// Login Page
router.get("/login", forwardAuthenticated, (req, res) => {
    res.render("login", { title: "Login", layout: "layout" });
});

// Register Page
router.get("/register", forwardAuthenticated, (req, res) => {
    res.render("register", { title: "Register", layout: "layout" });
});

const storage = multer.diskStorage({
    destination: './public/uploads/'
});

// Init Upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
});

// Check File Type
function checkFileType(file, cb) {
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}
// Register
router.post("/register", upload.single('avatar'), (req, res) => {
    //const {name, email, password, password2||avatar} = req.body;
    const name = req.body.name
    const email = req.body.email
    const password = req.body.password;
    const password2 = req.body.password2;


    let errors = [];
    //
    // if (!name || !email || !password || !password2) {
    //     errors.push({msg: "Please enter all fields"});
    // }
    // if (password && password.length < 6) {
    //     errors.push({msg: "Password must be at least 6 characters"});
    // }
    // if (password != password2) {
    //     errors.push({msg: "Passwords do not match"});
    // }

    if (errors.length > 0) {
        res.render("register", {
            errors,
            name,
            email,
            password,
            password2,
            title: "Register",
            layout: "Layout",
        });
    } else {
        User.findOne({ email: email }).then((user) => {
            if (user) {
                errors.push({ msg: "Email already exists" });
                res.render("register", {
                    errors,
                    name,
                    email,
                    password,
                    password2,
                    title: "Register",
                    layout: "Layout",
                });
            } else {
                const directory = "/images/";
                const newUser = new User({
                    name,
                    email,
                    password,
                    avatar: `./public/uploads/${req.file}`
                });
                const filePath = path.join(__dirname, "../public/uploads/");
                // fs.rename(filePath + req.file.filename + path.extname(req.file.originalname), req.file.fieldname + '-' + newUser._id + path.extname(req.file.originalname), (error) => {
                fs.rename(filePath + req.file.filename + path.extname(req.file.originalname), req.file.fieldname + '-' + newUser._id + path.extname(req.file.originalname), (error) => {
                    if (error) {
                        return console.log(`Error: ${error}`);
                    }
                });
                newUser.avatar = 'public/uploads/' + req.file.fieldname + '-' + newUser._id + path.extname(req.file.originalname);
                console.log(newUser);
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser
                            .save()
                            .then((user) => {
                                req.flash(
                                    "success_msg",
                                    "You are now registered and can log in"
                                );
                                res.redirect("/users/login");
                            })
                            .catch((err) => console.log(err));
                    });
                });
            }
        });
    }
});

// Login
router.post("/login", (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: "/dashboard",
        failureRedirect: "/users/login",
        failureFlash: true,
    })(req, res, next);
});

// Logout
router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success_msg", "You are logged out");
    res.redirect("/users/login");
});

module.exports = router;
