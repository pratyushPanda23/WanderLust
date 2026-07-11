const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Listing = require("./MODELS/Listing");
const { title } = require("process");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const Review = require("./MODELS/Review.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./MODELS/user.js");

//  CONNECTIOM WITH MONGOOSE
connect()
  .then(() => {
    console.log("Connection Successful");
  })
  .catch((err) => {
    console.log(err);
  });

async function connect() {
  await mongoose.connect("mongodb://127.0.0.1:27017/travelLust");
  const Connection = mongoose.connection;
  // console.log(Connection.readyState);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const sessionOptions = {
  secret: "mysupersecretstring",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.get("/", (req, res) => {
  res.send("Hi, I am root");
});

app.use(session(sessionOptions));
app.use(flash());

//1 login for 1 session
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// app.get("/demouser", async (req, res) => {
//   let fakeUser = new User({
//     email: "pratyush@gmail.com",
//     username: "yush",
//   });
//   let registeredUser = await User.register(fakeUser, "hello");
//   res.send(registeredUser);
// });

//Middleware to use the Listings model
app.use("/Listings", listingRouter);

//Middleware to use the Reviews model
app.use("/listings/:id/reviews", reviewRouter);

//Middleware to use the User model
app.use("/", userRouter);

//For any random route if all fails this error will handle the page not found
app.use((req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

//Error Handling Middleware
app.use((err, req, res, next) => {
  let { status = 500, message = "Some Error Occured" } = err;
  console.log("STATUS:", err.status);
  console.log("MESSAGE:", err.message);
  res.status(status).render("error.ejs", {
    err,
  });
});

//app listening
app.listen(8080, () => {
  console.log("Server is listening at port 8080");
});
