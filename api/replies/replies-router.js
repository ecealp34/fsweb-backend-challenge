const router = require('express').Router();
const Reply = require('./replies-model');
const { validateReplyId } = require('./replies-middleware');

router.get('/',  async (req,res,next) => {
    try {
       const replies = await Reply.getAll()
       res.json(replies)
    } catch (error) {
       next(error)
    }
})

router.get('/:id', validateReplyId, async (req,res,next) => {
   try {
        res.json(req.reply)
   } catch (error) {
       next(error)
   }
})

router.post('/', async (req,res,next) => {
   try {
     let inserted = {
        reply_id: req.body.reply_id,
        reply: req.body.reply,
        user_id: req.body.user_id,
        tweet_id: req.body.tweet_id
    }
        const insertedReply = await Reply.create(inserted);
        res.status(201).json(insertedReply) 
   } catch (error) {
        next(error)
   }
})

router.put('/:id', validateReplyId, async (req,res,next) => {
    try {
     let updated = {
        reply_id: req.body.reply_id,
        reply: req.body.reply,
        user_id: req.body.user_id,
        tweet_id: req.body.tweet_id
     }  
     const updatedReply = await Reply.update(req.params.id, updated);
     res.status(200).json({message: `${req.params.id} id'li reply güncellendi`})   
    } catch (error) {
        next(error)
    }
})


router.delete('/:id', validateReplyId, async (req,res,next) => {
   try {
        const { id } = req.params;
        const deletedTweet = await Reply.remove(id);
        res.status(200).json({message: `${id} id'li reply silindi`})
    } catch (error) {
        next(error)
    }
})

module.exports = router;



