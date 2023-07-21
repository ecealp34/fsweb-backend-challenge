const router = require('express').Router();
const Tweet = require('./tweets-model');
const { validateTweetId, } = require('./tweets-middleware');


router.get('/',  async (req,res,next) => {
     try {
        const tweets = await Tweet.getAll()
        res.json(tweets)
     } catch (error) {
        next(error)
     }
 })

router.get('/:id', validateTweetId, async (req,res,next) => {
    try {
         res.json(req.tweet)
    } catch (error) {
        next(error)
    }
 })

 router.post('/', async (req,res,next) => {
    try {
      let inserted = {
         tweet_id: req.body.tweet_id,
         text: req.body.text,
         user_id: req.body.user_id
     }
         const insertedTweet = await Tweet.create(inserted);
         res.status(201).json(insertedTweet) 
    } catch (error) {
         next(error)
    }
 })

 router.put('/:id', validateTweetId, async (req,res,next) => {
     try {
      let updated = {
         tweet_id: req.body.tweet_id,
         text: req.body.text,
         email: req.body.email,
         user_id: req.body.user_id
      }  
      const updatedTweet = await Tweet.update(req.params.id, updated);
      res.status(200).json({message: `${req.params.id} id'li tweet güncellendi`})   
     } catch (error) {
         next(error)
     }
 })


 router.delete('/:id', validateTweetId, async (req,res,next) => {
    try {
         const { id } = req.params;
         const deletedTweet = await Tweet.remove(id);
         res.status(200).json({message: `${id} id'li tweet silindi`})
     } catch (error) {
         next(error)
     }
 })

module.exports = router;