const User = require('./user');
const Role = require('./role');
const Member = require('./member');
const Community = require('./community');


User.hasMany(Community,{foreignKey:"id"});
Community.belongsTo(User,{foreignKey:"owner"});

User.hasMany(Member,{ foreignKey: 'id' });
Member.belongsTo(User,{ foreignKey: 'user_id' });

Role.hasMany(Member, { foreignKey: 'id' });
Member.belongsTo(Role, { foreignKey: 'role_id' });

Community.hasMany(Member, { foreignKey: 'id' });
Member.belongsTo(Community, { foreignKey: 'community_id' });

