//entry points db
const mongoose = require("mongoose");
const Offer = require("../dbs/mgmodel");
const user = require("../dbs/User");
//server
const express = require("express");
const app = express();
const port = 8081;
//parser
var bodyParser = require("body-parser");

//validator
const { body, validationResult } = require("express-validator");
const { check } = require("express-validator");

//bcrypt
const bcrypt = require("bcrypt");

//jwt
var jwt = require("jsonwebtoken");
const secretCode = "CodeRed";

//query parser
const { MongooseQueryParser } = require("mongoose-query-parser");
const parser = new MongooseQueryParser();
// parser.parse(query: string, predefined: any) : QueryOptions
// cors
const cors = require("cors");
app.use(
  cors({
    origin: "*",
  })
);
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
  res.send("welcome to home page !");
});

app.post(
  "/signup",
  body("userEmail").isEmail(),
  // body('password').isLength({ min:8})
  check("password")
    .isLength({ min: 5 })
    .withMessage("passsword must be at least 5 chars long"),
  (req, res) => {
    const { userEmail, password } = req.body;
    // console.log(req.body)
    // Finds the validation errors in this request and wraps them in an object with handy functions
    // var hashed=""
    /*// group mentoring 
    //can not get the returned the hashed values and store in the other variable 
  async function hashedPassword(){
    let hashed=await(bcrypt.hash(password, 10, async function(err, hash) {
      // Store hash in your password DB.
      // // hashed=hash
      // console.log("pas hash",hash)
      return hash
  })).then((value)=>console.log(value))
    // console.log("hash ",hashed)
    return hashed
  }
*/

    //express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // async function hashedPassword(){
    bcrypt.hash(String(password), 10, async function (err, hash) {
      if (err) {
        console.log("error in hashing", err);
      }
      if (hash) {
        const updated = { userEmail: userEmail, password: hash };

        var token = jwt.sign(updated, secretCode);
        // console.log(token)
        let updatedwithToken = { ...updated, token: token };
        // console.log("updated ",updatedwithToken );
        const userdb = new user(updatedwithToken);
        userdb.save(function (err, result) {
          if (err) {
            // console.log("erroe",err)
            res.send("you are already signed in ..login !");
          }
          if (result) {
            // console.log(result);
            res.send("you are signed in !");
          }
        });
      }
    });

    // console.log(req.body)
    //  hashedPassword().then(()=>{
  }
);

app.post(
  "/login",
  body("userEmail").isEmail(),
  // body('password').isLength({ min:8})
  check("password")
    .isLength({ min: 5 })
    .withMessage("passsword must be at least 5 chars long"),
  async (req, res) => {
    let { userEmail, password } = req.body;
    //express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    await user
      .findOne({ userEmail: userEmail }, (err, result) => {
        if (result?.userEmail == userEmail) {
          let hash = result.password;
          bcrypt.compare(String(password), hash).then(function (result) {
            // console.log(result)
            if (result) {
              res.send("sucessssss");
            } else {
              res.send("password u entered is wrong .put correct password");
            }
          });
        } else {
          res.send("user does not exist... first sign in");
        }
      })
      .clone();
  }
);

app.use("/objects", (req, res, next) => {
  // console.log(req.headers.authorization)
  let token = req.headers.authorization;
  jwt.verify(token, secretCode, function (err, decoded) {
    if (err) {
      console.log("error while verifying");
      res.send(
        JSON.stringify({ status: "faliure", message: "error while verifying" })
      );
      return;
    }
    if (decoded) {
      // if(req.method=="PUT" || req.method=="POST"){
      //   console.log(req.method)
      // }//
      // console.log("decided ",decoded)
      next();
    } else {
      res.send("failed verifying the credentials .. try again");
    }
  });
});
app.post(
  "/objects",
  body("offer_id").isString(),
  body("offer_title").isString(),
  body("offer_description").isString(),
  body("offer_image").isString(),
  body("content.*.item_id").isString(), // for array with objects "wild card round :)"
  body("content.*.quantity").isNumeric(),
  body("schedule.days_of_week").isArray(),
  body("schedule.dates_of_month").isArray(),
  body("schedule.months_of_year").isArray(),
  body("schedule.days_of_week.*").isNumeric(),
  body("schedule.dates_of_month.*").isNumeric(),
  body("schedule.months_of_year.*").isNumeric(),
  body("pricing.*.currency").isNumeric(),
  body("pricing.*.cost").isNumeric(),
  // body('target', "target condition is not right") // not one age and insalled dayts ...it may varry
  // .matches(/(\w+\s*(>|<)\s*\d+\s*)\s*/g), //age > 30 and install < 30
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // console.log(req.body)
    // console.log("checj ",check("schedule.*.days_of_week").isArray())
    const offerdetails = new Offer(req.body);
    offerdetails.save(function (err, result) {
      if (err) {
        console.log("error while storing in database", err);
        return res.send(`this objects is Already Exsist ${req.body.offer_id}`);
      }
      if (result) {
        let str = req.body.target;

        //age > 30 id
        // var re = /\w+\s*  ((>|<)\s*  \d+\s*)/g
        // match = re.exec(str);

        str = str.split(/(and|or)/);
        let condition = true;
        for (let i = 0; i < str.length; i++) {
          if (str[i] != "and" && str[i] != "or") {
            let regex = new RegExp(/[\w+]\s*[<,>]\s*[\d+]\s*/g);
            if (regex.test(str[i])) {
              condition = true;
            } else {
              condition = false;
              break;
            }
          }
        }
        if (!condition) {
         return  res.send("incorrect target value");
        }
        // let condition=true
        // for(let i=0;i<str.length;i++){
        //   if(str[i]==">" || str[i]=="<" ){
        //     condition=true
        //   }else{
        //      condition=false
        //   }
        // }
        // if(condition){
        //   res.send("incorrect target value")
        // }

        res.send(`validated and objects is created with ${req.body.offer_id}`);
      }
    });
  }
);

app.put(
  "/objects",
  body("offer_id").isString().optional(),
  body("offer_title").isString().optional(),
  body("offer_description").isString().optional(),
  body("offer_image").isString().optional(),
  body("content.*.item_id").isString().optional(), // for array with objects "wild card round :)"
  body("content.*.quantity").isNumeric().optional(),
  body("schedule.days_of_week").isArray().optional(),
  body("schedule.dates_of_month").isArray().optional(),
  body("schedule.months_of_year").isArray().optional(),
  body("schedule.days_of_week.*").isNumeric().optional(),
  body("schedule.dates_of_month.*").isNumeric().optional(),
  body("schedule.months_of_year.*").isNumeric().optional(),
  body("pricing.*.currency").isNumeric().optional(),
  body("pricing.*.cost").isNumeric().optional(),
  // body('target', "target condition is not right")  // not one age and insalled dayts ...it may varry
  // .matches(/age\s*(>|<)\s*\d+\s*(and|or)\s*installed_days\s*(>|<)\s*\d+\s*/)
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    console.log("put coming");
    let str = req.body.target;

    if (str) {
      console.log("working ins");
      str = str.split(/(and|or)/);
      let condition = true;
      for (let i = 0; i < str.length; i++) {
        if (str[i] != "and" && str[i] != "or") {
          let regex = new RegExp(/[\w+]\s*[<,>]\s*[\d+]\s*/g);
          if (regex.test(str[i])) {
            condition = true;
          } else {
            condition = false;
            break;
          }
        }
      }
      console.log("before ", str?.length);

      if (!condition || str?.length == 0) {
        console.log("after ", str?.length);

        // res.send("incorrect target value")
        res.send(
          JSON.stringify({
            status: "failure",
            message: "incorrect target value",
          })
        );
        return;
      }
    }
    if (str?.length == 0) {
      res.send(
        JSON.stringify({ status: "failure", message: "not empty target value" })
      );
      return;
    }

    const { offer_id } = req.body;
    await Offer.findOne({ offer_id }, async (err, result) => {
      if (err) {
        console.log("error", err);
      }
      if (result) {
        const filter = { offer_id };
        const update = req.body;
        await Offer.findOneAndUpdate(filter,update)
        res.send(
          JSON.stringify({
            status: "success",
            message: `${offer_id} is updated`,
          })
        );
      } else {
        // res.send("this data not exist");
        res.send(
          JSON.stringify({ status: "failure", message: "this data not exist" })
        );
      }
    }).clone();
  }
);

app.get("/objects", async (req, res) => {
  const { attribute, query } = req.query;
  let { records, page } = req.query;
  records = parseInt(records);
  page = parseInt(page);
  //oofer id // off 101
  // attribute
  console.log(req.query);
  // console.log("params",req.params);
  // const newattribute=req.query.attribut// before midde ware also does not work
  // const query=req.query.query
  // console.log((attribute),query);
  // console.log(newattribute, query);

  // let parsedQuery=parser.parse(req.query) // does nto work even after middle ware
  // console.log(parsedQuery.filter.attribute)
  // let att=parsedQuery.filter.attribute
  // let qu=parsedQuery.filter.query
  //     const filter={
  //       att:qu
  //     }

  // filtermanulayy
  let filter = {};
  // if (attribute == "offer_id") { //not required
  //   filter = { offer_id: query };
  // } else if (attribute == "offer_title") {
  //   console.log("coming");
  //   filter = { offer_title: query };
  // } else if (attribute == "offer_description") {
  //   filter = { offer_description: query };
  // } else if (attribute == "offer_image") {
  //   filter = { offer_image: query };
  // }
  // .find({$or:[{ category: {$in: arrayOfCategories}, skills: {$in: arrayOfSkill}]}
  // const user = await User.find({ email: 'john@acme.com', hashedPassword: { $ne: null } }).setOptions({ sanitizeFilter: true });

  // newattribute
  // console.log("filter" , filter);
  await Offer.find(filter, async (err, result) => {
    if (err) {
      console.log("err", err);
    }
    if (result) {
      console.log(result.length);
      //sorting algo
      console.log("result ", result.length);
      let patternOrderHash = new Map();
      let pattern = query;
      for (let i = 0; i < pattern?.length; i++) {
        patternOrderHash.set(pattern[i], i);
      }

      // function stringNames(a,b){
      //   console.log(a,b)
      //   // return{
      // if(attribute=="offer_id"){
      //     let str1=a.offer_id
      //     let str2=b.offer_id
      //   }else if(attribute=="offer_title"){
      //     let str1=a.offer_title
      //     let str2=b.offer_title
      //   }else if(attribute=="offer_description"){
      //     let str1=a.offer_description
      //     let str2=b.offer_description
      //   }else if(attribute=="offer_image"){
      //     let str1=a.offer_image
      //     let str2=b.offer_image
      //   }
      // }

      function patternMatch(a, b) {
        let str1;
        let str2;
        if (attribute == "offer_id") {
          str1 = a.offer_id;
          str2 = b.offer_id;
        } else if (attribute == "offer_title") {
          str1 = a.offer_title;
          str2 = b.offer_title;
        } else if (attribute == "offer_description") {
          str1 = a.offer_description;
          str2 = b.offer_description;
        } else if (attribute == "offer_image") {
          str1 = a.offer_image;
          str2 = b.offer_image;
        }
        // stringNames(a,b)
        if (str1 == pattern || str2 == pattern) {
          return -1;
        } else {
          return 1;
        }
      }

      // console.log("res" ,result)
      if (attribute) {
        if (query) {
          ///////sorting////////
          // sortingn  to match the queries strings in top
          function includescomp(a, b) {
            // console.log("dddddddddddddd stars")
            let str1;
            let str2;
            // console.log("1",a,"2",b)
            // stringNames(a,b)
            if (attribute == "offer_id") {
              str1 = a.offer_id;
              str2 = b.offer_id;
            } else if (attribute == "offer_title") {
              str1 = a.offer_title;
              str2 = b.offer_title;
            } else if (attribute == "offer_description") {
              str1 = a.offer_description;
              str2 = b.offer_description;
            } else if (attribute == "offer_image") {
              str1 = a.offer_image;
              str2 = b.offer_image;
            }
            // console.log(str1, " 1")
            // console.log("1",str1,"2",str2)
            // let b=b.offer_title
            // console.log('a======>',str1,'b=========>',str2)
            //   for (let i = 0; i < Math.min(str1.length, str2.length);i++) {
            //       if (patternOrderHash.get(str1[i]) != patternOrderHash.get(str2[i]))
            //           return patternOrderHash.get(str2[i]) - patternOrderHash.get(str1[i]);
            //   }

            if (
              str1 == pattern ||
              str2 == pattern ||
              (str1 && str1.includes(pattern)) ||
              (str2 && str2.includes(pattern))
            ) {
              return -1;
            } else {
              return 1;
            }
          }
          ////////////
          console.log("before patern matches", result.length);
          let includeSorted = await result.sort(includescomp);
          console.log("middle");
          let patternMatches = await includeSorted.sort(patternMatch);
          let splicedArray;
          console.log("after patern matches");

          if (page && records) {
            let startpage = (page - 1) * records;
            splicedArray = patternMatches.splice(startpage, records);
            res.send(`${splicedArray}`);
            return;
          } else if (!page && records) {
            splicedArray = patternMatches.splice(0, records);
            res.send(`${splicedArray}`);
            return;
          }

          return;
        } else {
          // attribute only
          res.send(
            "You are not sending query parameter to search. kindly enter.."
          );
          return;
        }
      } else {
        if (page && !records) {
          // splicedArray= patternMatches.splice(page,0)
          // console.log(page , records);
          res.send("You are not enter record details. kindly enter..");
          return;
        } else if (page && records) {
          let startpage = (page - 1) * records;
          result = result.splice(startpage, records);
          res.send(`${result}`);
          return;
        } else {
          res.send(`${JSON.stringify(result)}`);
        }
      }
    }
  }).clone();
});
app.delete("/objects", (req, res) => {
  const { offer_id } = req.body;
  //   Offer.remove({offer_id}, function (err,result) {  // itr cannnto show the documents that nto exist
  //     if (err){
  //         console.log(err)
  //     }
  //     else{
  //        res.send(`Offer with ${offer_id} Deleted `);
  //     }
  //  });

  Offer.findOneAndDelete({ offer_id }, function (err, docs) {
    if (err) {
      console.log(err);
    } else {
      if (docs) {
        res.send(`Offer with ${offer_id} Deleted `);
      } else {
        res.send(`Offer with ${offer_id} is not exsist`);
      }
    }
  });
});

app.post("/login", (req, res) => {
  res.send("welcome back login  !");
});

app.post("/add", (req, res) => {
  console.log(req.body);
  res.send("post received");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
