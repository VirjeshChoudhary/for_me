const express = require('express'); // server create
const app = express() //object bhejtha hai
const path = require('path');
const mongoose = require('mongoose'); // db se connect ke liye
const seedDB = require('./seed');// bta dia
const productRoutes = require('./routes/product');
const reviewRoutes = require('./routes/review');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
let configsession={
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    // cookie: { secure: true }
  }



mongoose.connect('mongodb://127.0.0.1:27017/julybatch')  // yeh promise return krta h isliye .then and  . catch se resolve krte hai
.then(()=>{console.log("DB connected")})  // jab mongoose chl jaayega 
.catch((err)=>{console.log("Error is: " , err)}) // agr nahi chla toh error


app.set('view engine' , 'ejs') // pehchaane ke liye ejs use kr rahe hai
app.set('views' , path.join(__dirname , 'views')) // views se connect kra h
app.use(express.static(path.join(__dirname , 'public'))); // public se connect kra h

app.use(express.urlencoded({extended:true})) // req.body ko use krne ke liye hum yeh use krte hai
app.use(methodOverride('_method'))

// seedDB() // ek baar add krke dubara hta do kyuki baar baar add hoga



app.use(session(configsession));
app.use(flash());
app.use((req,res,next)=>{
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    next();
})

app.use(productRoutes); // middleware hrr upcoming req pr chelgi 
app.use(reviewRoutes);

// jis port pr bhej rahe ho 
const PORT = 8080;
app.listen(PORT , ()=>{
    console.log(`Server running at port : ${PORT}`)
})

