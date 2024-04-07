const express = require('express');
const User = require('../models/User');
const { isLoggedin } = require('../middleware');
const Product = require('../models/Product');
const router = express.Router(); 
const stripe = require('stripe')('sk_test_51OyU0dSBko0KmiZ78LH1fjAFrnWravuLnhSq7zI7snNiQSqLGEUAeJSBapZA8EHMt6UC66S3qopsZ1um2diXt8H600BgaYKJpg')

router.get("/user/cart",async(req,res)=>{
    let userId=req.user._id;
    let user=await User.findById(userId).populate("cart");
    let totalAmount = user.cart.reduce((sum, curr) => sum + curr.price, 0);
    res.render('cart/cart',{user,totalAmount})
})

router.get('/checkout',async(req,res)=>{
    let userId=req.user._id;
    let user=await User.findById(userId).populate("cart");
    let totalAmount = user.cart.reduce((sum, curr) => sum + curr.price, 0);
    const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
              currency: 'inr',
              product_data: {
                name: 'T-shirt',
              },
              unit_amount: totalAmount*100,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: 'http://localhost:4242/success',
        cancel_url: 'http://localhost:4242/cancel',
      });
    
      res.redirect(303, session.url);
})

router.post("/user/:productId/add",isLoggedin,async(req,res)=>{
    let {productId}=req.params;
    let userId=req.user._id;
    let user=await User.findById(userId);
    let product=await Product.findById(productId);
    user.cart.push(product);
    await user.save();
    res.redirect('/user/cart');
})

module.exports = router;

