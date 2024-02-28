const express = require('express');
const User = require('../models/user');
const Community = require('../models/community');
const Member = require('../models/member');
const Role = require('../models/role');
const { Op,Sequelize } = require('sequelize');
const { userAuthIDPipe} = require('../middleware/auth');
const validator = require('validator');

const perPageCount =10;
const router = express.Router();

router.post('',userAuthIDPipe, async (req,res) => {
    try{
        
        const {name} = req.body;
        const id_ = req.body.decoded_ID;
        if (!name) {
            return res.status(400).json({
                message: 'Please enter all required fields',
                status: false,
            });
        }
        
        // Validate name field length
        if (!validator.isLength(name, { min: 2 })) {
            return res.status(400).json({
                message: 'Please enter a name of more than two characters',
                status: false,
            });
        }
        
        
        const community = await Community.findOne({ where:{
            name:name
        } });
        if (community) {
            return res.status(404).json({
                message: "Community already exists. Please sign up with a different email id",
                status: false,
            });
        }
        
        const newCommunity = await Community.create({
            name,
            slug : name.toLowerCase(),
            owner : id_
          });


        let role = await Role.findOne({ where:{
            name: "Community Admin"
        } });
        if(!role){
            const newRole= await Role.create({
                name: "Community Admin"
            });
            role = newRole;
        }
        
        // Add as a Community admin to member schema
        const newMember = await Member.create({
            communityId : newCommunity.id,
            userId : id_,
            roleId : role.id
        });
        
        return res.status(200).json({
            status: true,
            content: {
              data: newCommunity
            }

        });
            
            
        
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
      }
})



router.get('', async (req,res) => {
    try{
        
        const queryOptions = {
            include: [
                {
                  model: User
                }
            ]
          };
          
        const communities = await Community.findAll(queryOptions);
        if (!communities) {
            return res.status(404).json({
                message: "No communities found",
                status: false,
            });
        }
        
        
        const totalCount = communities.length;
        const page = 1
        const totalPageCount = totalCount%perPageCount;
        const offset = (page - 1) * perPageCount;
        queryOptions.offset = offset;
        queryOptions.limit = perPageCount;

        const communities_ = await Community.findAll(queryOptions);

        const responseData =[];
      
        for(const c of communities_)
        {
            let o = {
                id: c.user.id,
                name: c.user.name
            }
            let sim={
                id: c.id,
                name: c.name,
                slug: c.slug,
                owner: o,
                created_at: c.created_at,
                updated_at: c.updated_at 
            };
            responseData.push(sim);
            
        }

        return res.status(200).json({
            status: true,
            content: {
                meta: {
                    total: totalCount,
                    pages: totalPageCount,
                    page: 1
                },
              data: responseData
            }
        });
            
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
      }
})

router.get('/:id/members', async (req,res) => {
    try{
        const slug = req.params.id;        
        const c = await Community.findOne({
            where: {
                slug: slug
            }
        })
        const queryOptions = {
            include: [
                {
                  model: User,
                },
                {
                  model: Role,
                },
            ],
            where: {
                communityId : c.id
            }
        };
        const members = await Member.findAll(queryOptions);

        if (!members) {
            return res.status(404).json({
                message: "No communities found",
                status: false,
            });
        }
        
        
        const totalCount = members.length;
        const page = 1
        const totalPageCount = totalCount%perPageCount;
        const offset = (page - 1) * perPageCount;

        queryOptions.offset = offset;
        queryOptions.limit = perPageCount;
        const members_ = await Member.findAll(queryOptions);
        const responseData =[];

        for(const m of members_)
        {
            let o = {
                id: m.user.id,
                name: m.user.name
            }
            let r = {
                id: m.role.id,
                name: m.role.name
            }
            let sim={
                id: m.id,
                community: m.communityId,
                user: o,
                role: r,
                created_at: m.created_at
            };
            responseData.push(sim);
            
        }

        
        return res.status(200).json({
            status: true,
            content: {
                meta: {
                    total: totalCount,
                    pages: totalPageCount,
                    page: 1
                },
              data: responseData
            }
        });
            
            
        
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
      }
})


router.get('/me/owner',userAuthIDPipe, async (req,res) => {
    try{
              
        const id_ = req.body.decoded_ID;
        const queryOptions = {
            
            where: {
                owner : id_
            }
        };
        const communities = await Community.findAll(queryOptions);

        if (!communities) {
            return res.status(404).json({
                message: "No communities found",
                status: false,
            });
        }
        
        
        const totalCount = communities.length;
        const page = 1
        const totalPageCount = totalCount%perPageCount;
        const offset = (page - 1) * perPageCount;

        queryOptions.offset = offset;
        queryOptions.limit = perPageCount;
        const communities_ = await Community.findAll(queryOptions);
        
        return res.status(200).json({
            status: true,
            content: {
                meta: {
                    total: totalCount,
                    pages: totalPageCount,
                    page: 1
                },
              data: communities_
            }
        });
            
            
        
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
      }
})

router.get('/me/member', userAuthIDPipe, async (req,res) => {
    try{
        const id_ = req.body.decoded_ID; 

        const r = await Role.findOne({
            where: {
                name: "Community Member"
            }
        });
        const queryOptions = {
            attributes: ['communityId'],
            where: {
                userId : id_,
                roleId: r.id
            }
        };
        const communityIds = await Member.findAll(queryOptions);

        if (!communityIds) {
            return res.status(404).json({
                message: "No member communities found",
                status: false,
            });
        }
        const communityIdsArray = communityIds.map(member => member.dataValues.communityId);
        const queryOptions2 = {
            include: [
                {
                  model: User
                }
            ],
            where: {
              id: {
                [Op.in]: communityIdsArray
              }
            }
        }
        const communities = await Community.findAll(queryOptions2 );
          
        const totalCount = communities.length;
        const page = 1
        const totalPageCount = Math.ceil(totalCount / perPageCount);
        const offset = (page - 1) * perPageCount;
        queryOptions2.offset = offset;
        queryOptions2.limit = perPageCount;

        const communities_ = await Community.findAll(queryOptions2);

        const responseData =[];
      
        for(const c of communities_)
        {
            let o = {
                id: c.user.id,
                name: c.user.name
            }
            let sim={
                id: c.id,
                name: c.name,
                slug: c.slug,
                owner: o,
                created_at: c.created_at,
                updated_at: c.updated_at 
            };
            responseData.push(sim);
            
        }

        return res.status(200).json({
            status: true,
            content: {
                meta: {
                    total: totalCount,
                    pages: totalPageCount,
                    page: 1
                },
              data: responseData
            }
        });
            
            
        
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
      }
})


module.exports = router;