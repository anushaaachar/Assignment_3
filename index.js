// const express = require('express')
// const app = express()
// const bodyParser = require("body-parser");
const port = 3000
// app.set('views', './views');
// app.set('view engine', 'ejs');
// // app.use(express.urlencoded());


// // Parse JSON bodies (as sent by API clients)
// app.use(express.json());


// app.use(bodyParser.urlencoded({ extended: true }))

// app.use(bodyParser.json())
// // your code goes here


// app.post("/",(req,res)=>{
//     console.log(req.body)
//     let num1 = req.body.num1;
//     let num2 = req.body.num2;
//     let result = num1+num2
//     res.send(result)
// })

var express = require('express');
var bodyParser = require('body-parser');  
var app = express(); 
app.set('views', './views');
app.set('view engine', 'ejs'); 
app.get('/', (req,res)=>{
    console.log(res)
    res.send("hello Prajwal!")
   
})


app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json());  
app.get("/form",(req,res)=>{
    res.render("./form.ejs")
})

app.post('/math', function(req, res){
    let num1 = req.body.num1;
    let num2 = req.body.num2;
    
    if(req.body.submit === "add"){
        
        let result=Number(num1) + Number(num2)
        console.log(result);
        if(result > 1000000){
            res.status(400).send({status:"error",message:"Overflow",sum:result});
        }
        else if(isNaN(result) ||(num1==="" && num2==="")){
            res.status(400).send({status:"error",message:"Invalid data types",sum:result});
        }
        
        else if(typeof result === "number"){
            res.send({status:"success",message:"the sum of given two numbers",sum:result});
        }
    
        
    }
    else if(req.body.submit === "sub"){
        let result=Number(num1) - Number(num2)
        if(result < -1000000){
            res.status(400).send({status:"error",message:"Underflow",difference:result});
        }
        else if(isNaN(result) ||(num1==="" && num2==="")){
            res.status(400).send({status:"error",message:"Invalid data types",difference:result});
        }
       
        else if(typeof result === "number"){
            res.send({status:"success",message:"the difference of given two numbers",difference:result});
        }
    }
    else if(req.body.submit === "mul"){
        let result=Number(num1) * Number(num2)
        if(result < -1000000){
            res.status(400).send({status:"error",message:"Underflow",result:result});
        }
       else if(result > 1000000){
            res.status(400).send({status:"error",message:"Overflow",result:result});
        }
        else if(isNaN(result) ||(num1==="" && num2==="")){
            res.status(400).send({status:"error",message:"Invalid data types",result:result});
        }
       
        else if(typeof result === "number"){
            res.send({status:"success",message:"the difference of given two numbers",result:result});
        }
    }
    else{
        let result=Number(num1) / Number(num2)
        console.log(result)
        if(result === Infinity){
            res.status(400).send({status:"error",message:"Cannot divide by zero",result:result});
        }

       else if(result < -1000000){
            res.status(400).send({status:"error",message:"Underflow",result:result});
        }
       else if(result > 1000000){
            res.status(400).send({status:"error",message:"Overflow",result:result});
        }
        else if(isNaN(result) ||(num1==="" && num2==="")){
            res.status(400).send({status:"error",message:"Invalid data types",result:result});
        }
       
        else if(typeof result === "number"){
            res.send({status:"success",message:"the difference of given two numbers",sum:result});
        }
    }
   
});
app.listen(port, () => console.log(`App listening on port ${port}!`))

module.exports = app; 