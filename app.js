require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const authRoute = require("./routes/authRoute");
const userRoute = require("./routes/user");
const docsRoute = require("./routes/docsRoute");
const shortlistRoute = require("./routes/shortlistRoute");
const profileVisitor = require("./routes/profileVisitRoute");
const companRoutes = require("./routes/companyRoute");
const reviewRoutes = require("./routes/reviewRoute");
const passport = require("passport");
const { jwtStrategy } = require("./config/passport");

const app = express();

app.use(helmet());
app.use(morgan("tiny"));
app.use(cors({ origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(passport.initialize());
passport.use("jwt", jwtStrategy);

global.__basedir = __dirname;

// Routes
app.get("/", (req, res, next) => {
  try {
    res.json({
      status: "success",
      message: "Welcome 🙏",
    });
  } catch (err) {
    return next(err);
  }
});

app.use([
  userRoute,
  authRoute,
  shortlistRoute,
  profileVisitor,
  companRoutes,
  reviewRoutes,
]);

app.use("/docs", docsRoute);

//404 error
app.get("*", function (req, res) {
  res.status(404).json({
    message: "What?? 🙅",
  });
});

//An error handling middleware
app.use((err, req, res, next) => {
  console.log("🐞 Error Handler");

  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    err: err,
  });
});

// Run the server
const port = process.env.PORT || 3000;
app.listen(port, () =>
  console.log(`🐹 app listening on http://localhost:${port}`)
);
