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
        let review  = new Review({ rating , comment });
        product.reviews.push(review);
        await product.save();
        await review.save(); 
        req.flash('success','Review added successfully');
        res.redirect(`/products/${id}`);
    }
    catch(e){
        res.render('error' , {err : e.message})
    }
})

module.exports = router;

