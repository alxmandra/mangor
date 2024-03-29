const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const session = require('express-session')
const {ROUTES} = require("./routes/appRoutes");
const {setupRateLimit} = require("./middlewares/ratelimit");
const {setupLogging} = require("./middlewares/logging");
const {setupProxies} = require("./middlewares/proxy");

if (process.env.NODE_ENV !== "production") {
  // Load environment variables from .env file in non prod environments
  require("dotenv").config();
}
require("./utils/connectdb");

require("./strategies/JwtStrategy");
require("./strategies/LocalStrategy");
require("./authenticate");

const userRouter = require("./routes/userRoutes");

const app = express();

app.use(bodyParser.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

//Add the client URL to the CORS policy

const whitelist = process.env.WHITELISTED_DOMAINS
  ? process.env.WHITELISTED_DOMAINS.split(",")
  : [];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },

  credentials: true,
  exposedHeaders: ['set-cookie'],
};

app.use(cors(corsOptions));
app.use(session({}));

app.use(passport.initialize());
app.use(passport.session());

app.use("/usersStore", userRouter);

app.get("/", function (req, res) {
  res.send({ status: "success" });
});
// setup middlewares
setupLogging(app);
setupProxies(app, ROUTES);
setupRateLimit(app, ROUTES);

app.disable('x-powered-by')
//Start the server in port 3002

const server = app.listen(process.env.PORT || 3002, function () {
  const port = server.address().port;

  console.log("App started at port:", port);
});
