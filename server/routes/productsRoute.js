const router = require("express").Router();
const Product = require("../models/productModel");
const User = require("../models/usermodel")
const Notification = require("../models/notificationModel")
const authMiddleware = require("../middleware/authMiddleware");

const multer = require("multer");
const cloudinary = require("../config/cloudinaryConfig");

//add a new product

router.post("/add-product", authMiddleware, async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();

        //send notification to admin
        const admins = await User.find({ role: "admin" })
        admins.forEach(async (admin) => {
            const newNotification = new Notification({
                user: admin._id,
                message: `New Product Added by ${req.user.name}`,
                title: "New Product",
                onClick: `/admin`,
                read: false
            })
        })
        await newNotification.save();

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
        const { seller, category = [], age = [], status, search } = req.body
        let filters = {}
        if (seller) {
            filters.seller = seller;
        }
        if (status) {
            filters.status = status;
        }


        if (category.length > 0) {
            filters.category = { $in: category }
        }

        if (age.length > 0) {
            age.forEach(element => {
                const fromAge = element.split("-")[0];
                const toAge = element.split("-")[1];
                filters.age = { $gte: fromAge, $lte: toAge };
            });
        }

        if (search) {
            filters.name = search;
        }

        const products = await Product.find(filters).populate('seller').sort({ createdAt: -1 });

        res.send({
            success: true,
            data: products
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

router.get("/get-product-by-id/:id", authMiddleware, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate("seller");
        res.send({
            success: true,
            data: product,
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
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, { status });

        //notification to user
        const newNotification = new Notification({
            user: updatedProduct.seller,
            title: `Product Status Updated`,
            message: `Your product ${updatedProduct.name} has been ${status}`,
            onClick: `/profile`,
            read: false
        })
        await newNotification.save();


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