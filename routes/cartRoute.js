const express = require('express')
const cart = require('../models/cartModel')
const router = express.Router()
const port = 3000



router.post('/post-cart',async(req,res)=>{
    try {
        const {user,product,quantity} =req.body
        if (!user || !product ){
            return res.status(400).json({message: "User and Product are required"})
        }
        const newData = await cart.create({user, product, quantity})
        res.status(201).json(newData)
    } catch (error) {
        res.status(400).json(error)
    }
})



router.get('/get-cart/:userId',async(req,res)=>{
    try {
        const userId = req.params.userId;
        const data = await cart.find({user: userId}).populate('user').populate('product');  // Populating referenced data
        res.status(200).json(data);
    } catch (error) {
        res.status(400).json(error)
    }
})

router.get('/get-cart', async (req, res) => {
    try {
        const data = await cart.find()
            .populate('user')
            .populate('product');
        res.status(200).json(data);
    } catch (error) {
        res.status(400).json(error);
    }
});


router.put('/put-cart/:id',async(req,res)=>{
    try {
        const id = req.params.id
        const updateData = await cart.findOneAndUpdate({_id:id},req.body,{ new: true })
        res.status(200).json(updateData)
    } catch (error) {
        res.status(400).json(error)
    }
})

router.delete('/delete-cart/:id', async (req, res) => {
    try {
      const id = req.params.id; 
      const deleteData = await cart.findByIdAndDelete(id);
      if (!deleteData) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.status(200).json({ message: "Product deleted successfully", deletedProduct: deleteData });
    } catch (error) {
      res.status(400).json(error);
    }
  });

  module.exports = router