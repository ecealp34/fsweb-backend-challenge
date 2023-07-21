const jwt = require('jsonwebtoken');
const User = require('../users/users-model');
const { JWT_SECRET } = require('../../config');

const restricted = (req,res,next) => {
   try {
    let token = req.headers.authorization;
    if(!token) {
        res.status(400).json({message: "Token gereklidir..."})
    } else {
        jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
            if(!err) {
                req.decodedToken = decodedToken;
                next();
            } else {
                next({message: "Token geçersiz..."})
            }
        }) 
    }
   } catch (error) {
    next(error)
   }
}

const generateToken = (user) => {
    const payload = {
        user_id: user.user_id,
        username: user.username,
        role_id: user.role_id,
        role_name: user.role_name
        
    }
    const token = jwt.sign(payload, JWT_SECRET, {expiresIn:'3h'})
    return token;
}

const validateEmail = async (req,res,next) => {
    const user = await User.getByEmail(req.body.email);
    if(user) {
        res.status(400).json({message: "Email daha önce alınmış"})
    } else {
        next()
    }
}

const checkRole = (role_name) => (req,res,next) => {
    if(req.decodedToken.role_name === role_name) {
        next()
    } else {
        res.status(403).json({message: "Giriş izniniz yok"})  
    }
}


module.exports = { restricted, generateToken, validateEmail, checkRole }
