const router = require("express").Router();
const Product = require("../models/productModel");

const authMiddleware = require("../middleware/authMiddleware");

const multer = require("multer");
const cloudinary = require("../config/cloudinaryConfig");

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

router.post("/get-products", authMiddleware, async (req, res) => {
    try {
        const { seller, categories = [], age = [] } = req.body
        let filters = {}
        if (seller) {
            filters.seller = seller
        }
        const products = await Product.find(filters).populate('seller').sort({ createdAt: -1 });

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


router.put("/edit-product/:id", authMiddleware, async (req, res) => {
    try {
        await Product.findByIdAndUpdate(req.params.id, req.body);

        res.send({
            success: true,
            message: "Product updated successfully",
        })

    } catch (error) {
        res.send({
            succcess: false,
            message: error.message,
        })

    }
})

router.delete("/delete-product/:id", authMiddleware, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.send({
            success: true,
            message: "Product deleted successfully",
        })

    } catch (error) {
        res.send({
            succcess: false,
            message: error.message,
        })

    }
})

//get image from pc

const storage = multer.diskStorage({
    filename: function (req, file, callback) {
        callback(null, Date.now() + file.originalname);
    },
});


//image upload to cloudinary
router.post("/upload-image-to-product", authMiddleware, multer({ storage: storage }).single('file'), async (req, res) => {
    try {



        const result = await cloudinary.uploader.upload(req.file.path, { folder: "MarketPlace" });

        const productId = req.body.productId;

        await Product.findByIdAndUpdate(productId, {
            $push: { images: result.secure_url },
        })

        res.send({
            success: true,
            message: "Image uploaded successfully",
            data: result.secure_url,
        })
    } catch (error) {
        console.log(error)
        res.send({
            success: false,
            message: error.message,
        })
    }
})


// update product status

router.put("/update-product-status/:id", authMiddleware, async (req, res) => {
    try {

        const { status } = req.body;
        await Product.findByIdAndUpdate(req.params.id, { status });
        res.send({
            success: true,
            message: "Product status updated successfully"
        })

    } catch (error) {

        res.send({
            success: false,
            message: error.message,
        })
    }
})



module.exports = router;