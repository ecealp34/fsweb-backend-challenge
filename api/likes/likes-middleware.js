const Like = require('./likes-model');


const validateLikeId = async (req,res,next) => {
    try {
        let { id } = req.params;
        const like = await Like.getById(id)
        if(!like) {
            res.status(400).json({message: `${id} id'li like yok...`})
        } else {
            req.like = like;
            next()
        }
    } catch (error) {
        next(error)
    }
}

module.exports = { validateLikeId }