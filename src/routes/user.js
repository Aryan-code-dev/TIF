const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const {generateHash} = require('../misc/helper');
const { userAuthIDPipe} = require('../middleware/auth');
const validator = require('validator');
const router = express.Router();

router.post('/signup',async (req,res) => {
    try{
        
        const {name,email,password} = req.body;

        // Validate presence of required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                message: 'Please enter all required fields',
                status: false,
            });
        }

        // Validate name length
        if (!validator.isLength(name, { min: 2 })) {
            return res.status(400).json({
                message: 'Please enter a name of more than two characters',
                status: false,
            });
        }

        // Validate password length
        if (!validator.isLength(password, { min: 6 })) {
            return res.status(400).json({
                message: 'Please enter a password of more than six characters',
                status: false,
            });
        }
        // First check if User exists
        const user = await User.findOne({ where:{
            email:email
        } });
        if (user) {
            return res.status(404).json({
                message: "User already exists. Please sign up with a different email id",
                status: false,
            });
        }
        const hashed_passsword =await generateHash(password);
        const newUser= await User.create({
            name,
            email,
            password: hashed_passsword
          });
        
        const token = await newUser.generateAuthToken();
        let result = {
            access_token: token,
        };
        return res.status(200).json({
            status: true,
            content: {
              data: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                created_at: newUser.created_at
              },
              meta: result
            }

        });
            
            
        
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Registration failed, internal server error' });
      }
})



router.post('/signin',async (req,res) => {
    try{
        
        const {email,password} = req.body;

        if(!email || !password)
        {
            return res.status(400).json({
                message: 'Please enter all required fields',
                status: false,
            });
        }
        // First Check- If User exists
        const user = await User.findOne({ where:{
            email:email
        } });
        if (!user) {
            return res.status(404).json({
                message: "User username not found. Invalid login credentials.",
                status: false,
            });
        }
        
        if (await bcrypt.compare(password,user.password)) {

            //use the generate auth token function to generate the token
            const token = await user.generateAuthToken();
            let result = {
                access_token: token,
            };
            
            return res.status(200).json({
                status: true,
                content: {
                  data: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    created_at: user.created_at,
                  },
                  meta: result
                }
    
            });
        }
        else {
            return res.status(401).json({
                message: "Incorrect password.",
            });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
})


router.get('/me',userAuthIDPipe, async (req,res) => {
    try{
        
        const id_ = req.body.decoded_ID;
        const user = await User.findOne({ where:{
            id:id_
        } });
        if (!user) {
            return res.status(404).json({
                message: "Invalid token",
                status: false,
            });
        }
        
       
        return res.status(200).json({
            status: true,
            content: {
                data: {
                id: user.id,
                name: user.name,
                email: user.email,
                created_at: user.created_at
                }
            }

        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
})


module.exports = router;