const router = require("express").Router();
const Product = require("../models/productModel");
const authMiddleware = require("../middleware/authMiddleware");

//add a new product

router.post("/add-product", authMiddleware, async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.send({
            success: true,
            message: "Product added Successfully"
        })
    } catch (error) {
        res.send({
            succcess: false,
            message: error.message,
        });
    }
});

//get all products

router.get("/get-products", authMiddleware, async (req, res) => {
    try {
        const products = await Product.find();
        res.send({
            success: true,
            products
        })
    } catch (error) {
        res.send({
            succcess: false,
            message: error.message,
        });
    }
});


router.put("/edit-product/:id", authMiddleware , async(req,res)=>{
    try {
        await Product.findByIdAndUpdate(req.params.id,req.body);
        console.log("correctdata")
        res.send({
            success:true,
            message:"Product updated successfully",
        })
        
    } catch (error) {
        res.send({
            succcess: false,
            message: error.message,
        })
        
    }
})

router.delete("/delete-product/:id", authMiddleware , async(req,res)=>{
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.send({
            success:true,
            message:"Product deleted successfully",
        })
        
    } catch (error) {
        res.send({
            succcess: false,
            message: error.message,
        })
        
    }
})

module.exports = router;