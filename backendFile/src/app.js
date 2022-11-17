//make router
//entry points db
// const router
const mongoose = require("mongoose");
const Offer = require("../dbs/mgmodel");
//server
const express = require("express");
const app = express();
const port = 3000;
//parser
var bodyParser = require("body-parser");

async function main() {
  await mongoose.connect("mongodb://localhost:27017/usersOffers");
}
main()
  .then(() => console.log("db connected"))
  .catch((err) => console.log(err));

/*body parser */
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/add", (req, res) => {
  console.log(req.body);
  res.send("post received");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
