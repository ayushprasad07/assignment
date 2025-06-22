const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const { uploadOnCloud } = require('../utils/cloudinary');
const {upload} = require('../middleWare/multer.middleWare')
const fs = require('fs');
const jwt = require('jsonwebtoken');
const path = require('path');
const fetchUser = require('../middleWare/fetchUser');
const Item = require('../models/Items');
const {sendConfirmationEmail} = require('../utils/email');


require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

//ROUTE 1
router.post('/signUp', upload.single('userImage'), [
  body('name', "Enter a valid name").isLength({ min: 3 }),
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Enter a valid password').isLength({ min: 5 })
], async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ error: result.array() });
  }

  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ message: "Sorry! a user with this email already exists" });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashPass = await bcrypt.hash(req.body.password, salt);

    let imageUrl = '';
      if (req.file) {
        const localFilePath = req.file.path;
        const userImageUpload = await uploadOnCloud(localFilePath);

        imageUrl = userImageUpload.secure_url;
        fs.unlinkSync(localFilePath);
      }


    user = await User.create({
      name: req.body.name,
      userImage: imageUrl,
      email: req.body.email,
      password: hashPass,
      gender: req.body.gender
    });

    const data = {
      users: {
        id: user._id.toString()
      }
    };

    const authToken = jwt.sign(data, process.env.JWT_SECRET);
    res.json({ message: "Account created successfully", user, authToken });

  } catch (error) {
    console.error(error); 
    res.status(500).json({ message: "Internal Server error" });
  }
});

//ROUTE 2:
router.post(
  '/login',
  [
    body('email', 'Invalid email').isEmail(),
    body('password', 'Password must be at least 5 characters').isLength({ min: 5 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: errors.array() });

    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        console.log('❌ No user found with email:', email);
        return res.status(400).json({ message: 'Invalid email or password.' });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        console.log(`❌ Password mismatch for user: ${email}`);
        return res.status(400).json({ message: 'Invalid email or password.' });
      }

      const payload = { users: { id: user._id.toString() } };
      const authToken = jwt.sign(payload, process.env.JWT_SECRET);


      res.status(200).json({
        message: 'Logged in successfully',
        user,
        authToken,
      });
    } catch (error) {
      console.error('Login Error:', error);
      res.status(500).json({ message: 'Internal Server Error during login' });
    }
  }
);

//ROUTE 3 : Add items 'add-item'
router.post('/add-item', fetchUser, upload.fields([
  { name: 'itemImage', maxCount: 1 },
  { name: 'additionalImage', maxCount: 5 }
]), async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, description, type } = req.body;

    if (!req.files || !req.files.itemImage) {
      return res.status(400).json({ message: "Cover Image is required" });
    }

    const coverFilePath = req.files.itemImage[0].path;
    const coverImageUpload = await uploadOnCloud(coverFilePath);
    const itemImageUrl = coverImageUpload.secure_url;
    fs.unlinkSync(coverFilePath);

    let additionalImageUrls = [];
    if (req.files.additionalImage) {
      for (const img of req.files.additionalImage) {
        const result = await uploadOnCloud(img.path);
        additionalImageUrls.push(result.secure_url);
        fs.unlinkSync(img.path);
      }
    }

    const item = await Item.create({
      name,
      type,
      description,
      itemImage: itemImageUrl,
      additionalImage: additionalImageUrls,
      addedBy: userId
    });

    res.status(200).json({ message: "Item Added Successfully", item });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server error" });
  }
});

//ROUTE 4 : Get all the items addes
router.get('/get-items',fetchUser,async(req,res)=>{
    try {
        const userId = req.user.id;
        const item = await Item.find();
        res.status(200).json({message:"Fetched Successfully",item});
    } catch (error) {
        res.status(500).json({message:"Internal Server error"});
    }
})

// ROUTE 5 : enquire the item
router.get('/enquire/:id',fetchUser,async(req,res)=>{
    try {
        const itemId = req.params.id;
        const item = await Item.findById(itemId).populate('addedBy');
        if(!item) return res.status(400).json({message:"Item not found"});
        sendConfirmationEmail(item.addedBy.name,item.addedBy.email);
        res.status(200).json({message:"Mail sent",item});
    } catch (error) {
        res.status(500).json({message:"Internal Server error"});
    }
})


module.exports = router;