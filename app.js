const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const houseRoute = require("./routes/house");

// console.log(`Node env: ${process.NODE_ENV}`);
// if (process.env.NODE_ENV !== "production") {
//   console.log("hahan, not in prod");
//   dotenv.config();
// }

dotenv.config();

const app = express();

// connect to mongo
mongoose.set("strictQuery", false);

mongoose.connect(
  process.env.MONGODB_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("database is connected");
    }
  }
);

// middleware
app.use(express.json());

app.get("/", function (req, res) {
  res.send("Hello World");
});

// routes
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/house", houseRoute);

app.listen(process.env.PORT, () =>
  console.log(`listening on port ${process.env.PORT}`)
);
