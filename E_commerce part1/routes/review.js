const express = require('express');
const Product = require('../models/Product');
const Review = require('../models/Review');
const { validateReview } = require('../middleware');
const router = express.Router(); 

router.post('/products/:id/review' , validateReview , async(req,res)=>{
    try{
        let { rating , comment } = req.body;
        let { id } = req.params;

        let product = await Product.findById(id); 
        let review  =await Review.create({ rating , comment });//we dont need save here bcz it is mongo db cmd
        product.reviews.push(review); 
        await product.save(); //bcz it is js command so we need to save it
        
        req.flash('success','Review added successfully');
        res.redirect(`/products/${id}`);
    }
    catch(e){
        res.render('error' , {err : e.message})
    }
})

module.exports = router;

