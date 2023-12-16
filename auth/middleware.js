const jwt = require('jsonwebtoken');
const  registeredUser = require('../models/homeschema');
const expressAsyncHandler = require('express-async-handler');
const store = require('store')


const protect = expressAsyncHandler(async (req, res, next) => {
    // let token;
      
        try {
            const token = store.get('accessToken').token
            // token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, "soham");
            console.log("decoded", decoded);
            req.user = await registeredUser.findOne(decoded.EmailId).select("-password");

            
            // console.log("req.user", req.user);
            // req.user = await registeredUser.findOne(decoded.role).select("-role");
            // console.log("req.user", req.user);
            next();
        } catch (error) {
            console.log(error);
            res.status(401);
            res.redirect('/ind')

            // throw new Error("Not authorized, token failed");
        }
    
   
}
);

module.exports = { protect };