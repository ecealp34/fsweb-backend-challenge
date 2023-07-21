const Tweet = require('../tweets/tweets-model');
const jwt = require('jsonwebtoken');



const validateTweetId = async (req,res,next) => {
    try {
        let { id } = req.params;
        const tweet = await Tweet.getById(id)
        if(!tweet) {
            res.status(400).json({message: `${id} id'li tweet yok...`})
        } else {
            req.tweet = tweet;
            next()
        }
    } catch (error) {
        next(error)
    }
}

module.exports = { validateTweetId }