require('./src/connection/connection.js');
require('./src/models/syncModels.js');
require('./src/models/associationOfForeignKeys.js')
const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));


app.use('/v1/auth',require('./src/routes/user.js'))
app.use('/v1',require('./src/routes/role.js'))
app.use('/v1/community',require('./src/routes/community.js'))
app.use('/v1/member',require('./src/routes/member.js'))

app.get('/',(req,res) => {
    res.send('<h1>Hello world</h1>');
})
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

module.exports = app;