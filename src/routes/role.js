const express = require('express');
const Role = require('../models/role');
const router = express.Router();
const validator = require('validator');
const perPageCount = 10;

router.post('/role',async (req,res) => {
    try{
        
        const {name} = req.body;

        if (!validator.isLength(name, { min: 2 })) {
            return res.status(400).json({
                message: 'Please enter a name of more than two characters',
                status: false,
            });
        }
        
        // First Check- If User exists
        const role = await Role.findOne({ where:{
            name:name
        } });
        if (role) {
            return res.status(404).json({
                message: "Role already exists. Please enter a new role",
                status: false,
            });
        }
       
        const newRole= await Role.create({
            name
        });
        
        
        
        return res.status(200).json({
            status: true,
            content: {
              data: {
                id: newRole.id,
                name: newRole.name,
                created_at: newRole.created_at,
                updated_at: newRole.updated_at
              }
            }

        });
            
            
        
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
      }
})

router.get('/role',async (req,res) => {
    try{
    
        const totalCount = await Role.count();
        if (totalCount == 0) {
            return res.status(404).json({
                message: "No roles available",
                status: false,
            });
        }     

        const page = 1
        const totalPageCount = totalCount%perPageCount;
        const offset = (page - 1) * perPageCount;
        const roles = await Role.findAll({
            offset: offset,
            limit: perPageCount,
        });

        return res.status(200).json({
            status: true,
            content: {
            meta: {
                total: totalCount,
                pages: totalPageCount,
                page: 1
                },
            data: roles
            }

        });
            
            
        
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
      }
})


module.exports = router;