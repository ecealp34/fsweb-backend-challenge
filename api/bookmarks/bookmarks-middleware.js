const Bookmark = require('./bookmarks-model');


const validateBookmarkId = async (req,res,next) => {
    try {
        let { id } = req.params;
        const bookmark = await Bookmark.getById(id)
        if(!bookmark) {
            res.status(400).json({message: `${id} id'li bookmark yok...`})
        } else {
            req.bookmark = bookmark;
            next()
        }
    } catch (error) {
        next(error)
    }
}

module.exports = { validateBookmarkId }