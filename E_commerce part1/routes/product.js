const express = require('express');
const Product = require('../models/Product');
const Review = require('../models/Review');
const { validateProduct } = require('../middleware');
const router = express.Router(); 

//read
router.get('/products'  , async (req,res)=>{
    try{

        let products = await Product.find({});   // mongo db ka command hai isliye async await se resolve krte hai
        res.render('products/index' , {products})
    }
    catch(e){
        res.render('error' , {err : e.message})
    }
});

//new form
router.get('/products/new' , (req,res)=>{
    try{
        res.render('products/new');
    }
    catch(e){
        res.render('error' , {err : e.message})
    }
})

//actually adding
router.post('/products', validateProduct , async(req,res)=>{
    try{
        let {name , img , price , desc} = req.body;
        await Product.create({name , img , price , desc}); //create producta and add auto
        req.flash('success' , 'Product added successfully');
        res.redirect('/products'); //actually mai bhej dega
    }
    catch(e){
        res.render('error' , {err : e.message})
    }
})

//show particular product
router.get('/products/:id' , async(req,res)=>{
    try{

        let {id} = req.params;
        let foundProduct = await Product.findById(id).populate('reviews');
        // console.log(foundProduct);
        res.render('products/show' , {foundProduct} );
    }
    catch(e){
        res.render('error' , {err : e.message})
    }
})

//show edit form
router.get('/products/:id/edit' , async(req,res)=>{
    try{
        let {id} = req.params;
        // let foundProduct = await Product.findById(id);
        let foundProduct = await Product.findById(id);
        res.render('products/edit' , {foundProduct})
    }
    catch(e){
        res.render('error' , {err : e.message})
    }
})

//actully changing the product
router.patch('/products/:id' , validateProduct , async(req,res)=>{  //patch req for edit
    try{
        let {id} = req.params;
        let {name , img , price , desc} = req.body;
        await Product.findByIdAndUpdate(id , {name , img , price , desc} );
        req.flash('success' , 'Product edited successfully');
        res.redirect('/products')
    }
    catch(e){
        res.render('error' , {err : e.message})
    }
})

//deleting
router.delete('/products/:id' , async(req,res)=>{
    try{
        let {id} = req.params;
        let foundProduct = await Product.findById(id);
        for(let ids of foundProduct.reviews){
            await Review.findByIdAndDelete(ids);
        }

        await Product.findByIdAndDelete(id);
        req.flash('success' , 'Product deleted successfully');
        res.redirect('/products');
    }
    catch(e){
        res.render('error' , {err : e.message})
    }
})

module.exports = router;

