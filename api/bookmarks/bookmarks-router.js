const router = require('express').Router();
const { validateBookmarkId } = require('./bookmarks-middleware');
const Bookmark = require('./bookmarks-model');


router.get('/',  async (req,res,next) => {
    try {
       const bookmarks = await Bookmark.getAll()
       res.json(bookmarks)
    } catch (error) {
       next(error)
    }
})

router.get('/:id', validateBookmarkId, (req,res,next) => {
   try {
        res.json(req.bookmark)
   } catch (error) {
       next(error)
   }
})

router.post('/', async (req,res,next) => {
   try {
     let inserted = {
        bookmark_id: req.body.bookmark_id,
        total_number: req.body.total_number,
        user_id: req.body.user_id,
        tweet_id: req.body.tweet_id
    }
        const insertedBookmark = await Bookmark.create(inserted);
        res.status(201).json(insertedBookmark) 
   } catch (error) {
        next(error)
   }
})

router.put('/:id', validateBookmarkId, async (req,res,next) => {
    try {
     let updated = {
        bookmark_id: req.body.bookmark_id,
        total_number: req.body.total_number,
        user_id: req.body.user_id,
        tweet_id: req.body.tweet_id
     }  
     const updatedBookmark = await Bookmark.update(req.params.id, updated);
     res.status(200).json({message: `${req.params.id} id'li bookmark güncellendi`})   
    } catch (error) {
        next(error)
    }
})


router.delete('/:id', validateBookmarkId, async (req,res,next) => {
   try {
        const { id } = req.params;
        const deletedBookmark = await Bookmark.remove(id);
        res.status(200).json({message: `${id} id'li bookmark silindi`})
    } catch (error) {
        next(error)
    }
})

module.exports = router;

