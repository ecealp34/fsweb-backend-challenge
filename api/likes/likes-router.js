const router = require('express').Router();
const { validateLikeId } = require('./likes-middleware');
const Like = require('./likes-model');


router.get('/',  async (req,res,next) => {
    try {
       const likes = await Like.getAll()
       res.json(likes)
    } catch (error) {
       next(error)
    }
})

router.get('/:id', validateLikeId, (req,res,next) => {
   try {
        res.json(req.like)
   } catch (error) {
       next(error)
   }
})

router.post('/', async (req,res,next) => {
   try {
     let inserted = {
        like_id: req.body.like_id,
        total_number: req.body.total_number,
        user_id: req.body.user_id,
        tweet_id: req.body.tweet_id
    }
        const insertedLike = await Like.create(inserted);
        res.status(201).json(insertedLike) 
   } catch (error) {
        next(error)
   }
})

router.put('/:id', validateLikeId, async (req,res,next) => {
    try {
     let updated = {
        like_id: req.body.like_id,
        total_number: req.body.total_number,
        user_id: req.body.user_id,
        tweet_id: req.body.tweet_id
     }  
     const updatedLike = await Like.update(req.params.id, updated);
     res.status(200).json({message: `${req.params.id} id'li like güncellendi`})   
    } catch (error) {
        next(error)
    }
})


router.delete('/:id', validateLikeId, async (req,res,next) => {
   try {
        const { id } = req.params;
        const deletedLike = await Like.remove(id);
        res.status(200).json({message: `${id} id'li like silindi`})
    } catch (error) {
        next(error)
    }
})

module.exports = router;

