const Reply = require('./replies-model');



const validateReplyId = async (req,res,next) => {
    try {
        let { id } = req.params;
        const reply = await Reply.getById(id)
        if(!reply) {
            res.status(400).json({message: `${id} id'li reply yok...`})
        } else {
            req.reply = reply;
            next()
        }
    } catch (error) {
        next(error)
    }
}

module.exports = { validateReplyId }