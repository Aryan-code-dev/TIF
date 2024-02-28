const jwt = require("jsonwebtoken");
require('dotenv').config();

const userAuth = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).send({ message: "Missing Authorization header" });
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.APP_SECRET, (err, decoded) => {
    if (err) return res.status(401).send({ message: "Invalid token" }); //invalid token
    next();
  });
};

// function which does User Auth and also updates req body for further functions to use in the pipeline
const userAuthIDPipe = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if(!authHeader) return res.status(401).send({message: "Missing Authorization header"});
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.APP_SECRET, (err, decoded) => {
        if(err) return res.status(401).send({message: "Invalid token"});
        req.body.decoded_ID = decoded.id; // remember to use req.body.decoded_ID
        next();
    })
};


module.exports = {
    userAuth,
    userAuthIDPipe
  };