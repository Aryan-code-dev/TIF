const sequelize = require('../connection/connection');

async function syncModels()
{
    try{
        await sequelize.sync({alter:true});
        console.log('Synced models', new Date());
    } catch (error) {
        console.error('Unable to sync', error, new Date());
    }
    

}
syncModels();