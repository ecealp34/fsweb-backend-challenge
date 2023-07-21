const User = require('../users/users-model');

function validatePayload(req,res,next) {
    try {
        let { username, password, email } = req.body;
        if(!username || !password || !email) {
            res.status(400).json({message: "Gerekli alanlar eksik"})
        } else {
            next()
        }
    } catch (error) {
        next(error)
    }
}


async function validateId(req,res,next) {
    try {
        let { id } = req.params;
        const user = await User.getById(id)
        if(!user) {
            res.status(400).json({message: `${id} id'li kullanıcı yok...`})
        } else {
            req.user = user;
            next()
        }
    } catch (error) {
        next(error)
    }
}
 
module.exports = {
    validatePayload,
    validateId
}