const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const ejs = require('ejs');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;



const Student = require('./model/student');
const RecruiterCall = require('./model/recruiter')
const Notification = require("./model/notification")


// Database connection
mongoose.connect('mongodb://127.0.0.1:27017/placement', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(res => {
        console.log("connected to mongodb")
    })
    .catch(err => {
        console.log(err)
    })

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const sessionConfig = {
    name: 'session',
    secret: "ahgsdjsgfjgsdjgfjshdfkhfk",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure:true,
        expires: Date.now() + (1000 * 60 * 60 * 24 * 7),
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig));


app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

passport.use(new LocalStrategy(Student.authenticate()));
passport.serializeUser(Student.serializeUser());
passport.deserializeUser(Student.deserializeUser());



app.use(
    (req, res, next) => {
    res.locals.success = req.flash('success'),
    res.locals.error = req.flash('error')
    next();
    }
)

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
})



app.get("/", (req, res) => {
    res.render("index");
});

app.get("/about", (req, res) => {
    res.render("about")
})

app.get("/login", (req, res) => {
    res.render("login");
});

app.post("/login", passport.authenticate('local', { failureRedirect: '/login' }), (req, res) => {
    if(req.user.admin){
        return res.redirect("/admindashboard")
    }
    res.render("dashboard", { user: req.user });
});

app.get("/dashboard", (req, res) => {
    console.log(req.user);
    // res.render("dashboard", { user: req.user });
});


app.get("/notification", async(req, res) => {
    const notifications = await Notification.find({})
    res.render("notification", { notifications })
});

app.get("/announcement", async (req, res) => {
    const announcements = await RecruiterCall.find({})
    res.render("announcement", { announcements })
});

app.get("/admindashboard", async(req, res) => {

    const students = await Student.find({})

    res.render("admindashboard",{students})
});

app.get("/mocktests", (req, res) => {
    res.render("mocktests")
});

app.get("/accsettings", (req, res) => {
    res.render("accsettings")
});

app.get("/mocktestresult", (req, res) => {
    res.render("mocktestresult");
});


app.get("/logout", (req, res) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

app.get("/signup", (req, res) => {
    res.render("signup");
});

app.get("/forgotpassword", (req, res) => {
    res.render("forgotpassword");
});

app.get("/undermaintenance", (req, res) => {
    res.render("undermaintenance");
});

app.get("/error", (req, res) => {
    res.render("error");
});

app.get("/bcannouncement", (req, res) => {
    res.render("bcannouncement");
});

app.post("/bcannouncement", async (req, res) => {
    let { companyName, deadLine, description, preRequest, link } = req.body;
    description = description.trim();
    preRequest = preRequest.trim().split(",");
    const recruit = new RecruiterCall({ recruiterName: companyName, deadline: deadLine, description, prerequisites: preRequest, joinLink: link })
    await recruit.save()

    res.redirect('/announcement');
})

app.get("/bcnotification", (req, res) => {
    res.render("bcnotification");
});

app.post("/bcnotification", async(req, res) => {
    let { title, date, description } = req.body;
    description = description.trim();
    const notification = new Notification({ title, date, description })
    await notification.save()
    res.redirect('/notification');
});

app.get("/service", (req, res) => {
    res.render("service")
})

app.post("/signup", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = new Student({ username, email });
        const registeredUser = await Student.register(user, password);
        req.flash("success","signup successed")
        res.redirect("/login");
    } catch (err) {
        console.log(err);
        res.redirect("/signup");
    }
});

app.all("*", (req, res) => {
    res.render("error")
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`));