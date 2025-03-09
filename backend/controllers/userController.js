import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    
  });
};

// Route for user login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await userModel.findOne({
      email,
    });
    if (!user) {
      return res.json({ success: false, message: 'user not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    
    if (isMatch) {
      const token = createToken(user._id);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: 'Invalid Email or Password' });
    }


}catch (err) {
    console.log(err);
    res.json({ success: false, message: err.message });
  }
};

// Route for user registration
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: 'User already exists' });
    }

    // Validate email format and password length
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: 'Invalid Email' });
    }
    if (password.length < 6) {
      return res.json({ success: false, message: 'Password should be at least 6 characters' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });

    const user = await newUser.save();

    const token = createToken(user._id);

    res.json({ success: true, token });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: err.message });
  }
};

// Route for admin login
const adminLogin = async (req, res) => {
  try {

    const { email, password } = req.body;

    if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
    const token = jwt.sign({email,role:"admin"}, process.env.JWT_SECRET);
      res.json({ success: true, token });
    }else{
        res.json({ success: false, message: 'Invalid Email or Password' });
    }
   
    
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { loginUser, registerUser, adminLogin };