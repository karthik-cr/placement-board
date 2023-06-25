const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const ejs = require("ejs");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const passport = require("passport");
const session = require("express-session");
const LocalStrategy = require("passport-local").Strategy;

const Student = require("./model/student");
const RecruiterCall = require("./model/recruiter");
const Notification = require("./model/notification");
const MockTest = require("./model/mockTest");
const Events = require("./model/events");

// Database connection
mongoose
  .connect("mongodb://127.0.0.1:27017/placement", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((res) => {
    console.log("connected to mongodb");
  })
  .catch((err) => {
    console.log(err);
  });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const sessionConfig = {
  name: "session",
  secret: "ahgsdjsgfjgsdjgfjshdfkhfk",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure:true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionConfig));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

passport.use(new LocalStrategy(Student.authenticate()));
passport.serializeUser(Student.serializeUser());
passport.deserializeUser(Student.deserializeUser());

app.use((req, res, next) => {
  (res.locals.success = req.flash("success")),
    (res.locals.error = req.flash("error"));
  next();
});

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/login" }),
  (req, res) => {
    if (req.user.admin) {
      return res.redirect("/admindashboard");
    }
    if (req.user.recuiter) return res.redirect("/recruitersdash");

    res.render("dashboard", { user: req.user });
  }
);

app.get("/dashboard", (req, res) => {
  res.render("dashboard", { user: req.user });
});

app.get("/notification", async (req, res) => {
  const notifications = await Notification.find({});
  res.render("notification", { notifications });
});

app.get("/announcement", async (req, res) => {
  const announcements = await RecruiterCall.find({});
  res.render("announcement", { announcements });
});

app.get("/admindashboard", async (req, res) => {
  const students = await Student.find({});

  res.render("admindashboard", { students });
});

app.get("/adminaddtest", (req, res) => {
  res.render("adminaddtest");
});

app.get("/bcevents", (req, res) => {
  res.render("bcevents");
});

app.post("/bcevents", async (req, res) => {
  const { orgName, eventType, eventDate, Link, Description } = req.body;
  const event = new Events(req.body);
  await event.save();
  res.redirect("/bcevents");
});

app.get("/events", async (req, res) => {
  const events = await Events.find({});
  res.render("events", { events });
});

app.get("/adminaddresult", async (req, res) => {
  const students = await Student.find({});
  res.render("adminaddresult", { students });
});

app.post("/adminaddresult", async (req, res) => {
  const { testName, testType, totalMark, obtainedMark, id } = req.body;
  const student = await Student.findById(id);
  student.marks.push({ testName, testType, totalMark, obtainedMark });
  await student.save();
  res.redirect("/adminaddresult");
});

app.get("/mocktests", async (req, res) => {
  const mockTest = await MockTest.find({});
  const user = req.user;
  res.render("mocktests", { mockTest, user });
});

app.get("/accsettings", (req, res) => {
  const user = req.user;
  res.render("accsettings", { user });
});

// app.post("/accsettings",(req,res)=>{
//     const id = req.user._id
//     const student = await Student.findByIdAndUpdate(id,)
// })

app.get("/accountdetails", (req, res) => {
  const user = req.user;
  res.render("accountdetails", { user });
});

app.get("/placementtips", (req, res) => {
  const user = req.user;
  res.render("placementtips", { user });
});

app.get("/placementhistory", (req, res) => {
  const user = req.user;
  res.render("placementhistory", { user });
});

app.get("/recruitersdetails", (req, res) => {
  const user = req.user;
  res.render("recruitersdetails", { user });
});

app.get("/faq", (req, res) => {
  const user = req.user;
  res.render("faq", { user });
});

app.get("/aboutrecruiters", (req, res) => {
  const user = req.user;
  res.render("aboutrecruiters", { user });
});

app.get("/aboutcolleges", (req, res) => {
  const user = req.user;
  res.render("aboutcolleges", { user });
});

app.get("/contacts", (req, res) => {
  const user = req.user;
  res.render("contacts", { user });
});

app.get("/adminstudentsdetails", (req, res) => {
  res.render("adminstudentsdetails");
});

app.get("/mockTest/:id", async (req, res) => {
  const { id } = req.params;
  const { url } = req.query;
  const userId = req.user._id;
  const user = await Student.findById(userId);
  user.attended.push(id);
  await user.save();
  res.redirect(url);
});

app.get("/mocktestresult", (req, res) => {
  const student = req.user;
  res.render("mocktestresult", { student });
});

app.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.get("/forgotpassword", (req, res) => {
  res.render("forgotpassword");
});

app.post("/mockTest", async (req, res) => {
  const mockTest = new MockTest(req.body);
  await mockTest.save();
  res.redirect("/adminaddtest");
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

app.get("/recruitersdash", async (req, res) => {
  const students = await Student.find({});
  res.render("recruitersdash", { students });
});

app.get("/studentanalytics", async (req, res) => {
  const students = await Student.find({});
  res.render("studentanalytics", { students });
});

app.get("/adminstudentanalytics", async (req, res) => {
  const students = await Student.find({});
  res.render("adminstudentanalytics", { students });
});

app.post("/bcannouncement", async (req, res) => {
  let { companyName, deadLine, description, preRequest, link } = req.body;
  description = description.trim();
  preRequest = preRequest.trim().split(",");
  const recruit = new RecruiterCall({
    recruiterName: companyName,
    deadline: deadLine,
    description,
    prerequisites: preRequest,
    joinLink: link,
  });
  await recruit.save();

  res.redirect("/admindashboard");
});

app.get("/bcnotification", (req, res) => {
  res.render("bcnotification");
});

app.post("/bcnotification", async (req, res) => {
  let { title, date, description, type } = req.body;
  description = description.trim();
  const notification = new Notification({ title, date, description, type });
  await notification.save();
  res.redirect("/admindashboard");
});

app.get("/service", (req, res) => {
  res.render("service");
});

app.post("/signup", async (req, res) => {
  try {
    const { username, email, password, collegeName, registerNumber } = req.body;
    // console.log(req.body)
    const user = new Student({ username, email, collegeName, registerNumber });
    const registeredUser = await Student.register(user, password);
    req.flash("success", "signup successed");
    res.redirect("/login");
  } catch (err) {
    console.log(err);
    res.redirect("/signup");
  }
});

app.all("*", (req, res) => {
  res.render("error");
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
