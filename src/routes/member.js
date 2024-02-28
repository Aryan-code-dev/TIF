const express = require('express');
const User = require('../models/user');
const Community = require('../models/community');
const Member = require('../models/member');
const Role = require('../models/role');
const { userAuthIDPipe} = require('../middleware/auth');

const router = express.Router();

router.post('',userAuthIDPipe, async (req,res) => {
    try{
        
        const {community, user, role} = req.body;
        const id_ = req.body.decoded_ID;
        if(!community || !user || !role)
        {
            return res.status(400).json({
                message: 'Please enter all required fields',
                status: false,
            });
        }
        
        
        const community_ = await Community.findOne({
            where: {id: community}
        })
        
        if (community_.owner != id_) {
            return res.status(404).json({
                message: "NOT_ALLOWED_ACCESS",
                status: false,
            });
        }
        
        const existingMember = await Member.findOne({
            where: {
                communityId: community,
                userId: user,
                roleId: role
            }
        });

        if(existingMember){
            return res.status(400).json({
                message: "MEMBER ALREADY EXISTS",
                status: false,
            });
        }

        const newMember = await Member.create({
            communityId: community,
            userId: user,
            roleId: role
        });

        return res.status(200).json({
            status: true,
            content: {
              data: {
                id: newMember.id,
                community: newMember.communityId,
                user: newMember.userId,
                role: newMember.roleId,
                created_at: newMember.created_at,
              }
            }

        });
            
            
        
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
      }
})

router.delete('/:id',userAuthIDPipe, async (req,res) => {
    try{
        
        
        const id_ = req.body.decoded_ID;
        const memberRecordId = req.params.id;    
        
        
        const memrec = await Member.findOne({where: {id: memberRecordId}});


        const queryOptions = {
            include: [
                {
                  model: Role,
                },
            ],
            where: {
                communityId : memrec.communityId,
                userId: id_
            }
        };
        const roles = await Member.findAll(queryOptions);
        
        for(let i= 0;i<roles.length;i++) {
            
            if( roles[i].role.name === "Community Member" ){
                return res.status(404).json({
                    message: "NOT_ALLOWED_ACCESS",
                    status: false,
                });
            }
        }


        const deletedRecord = await Member.destroy({where: {id: memberRecordId}});
        if(deletedRecord){
            return res.status(200).json({
                status: true,
    
            });
        }
        
            
            
        
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
      }
})

module.exports = router;