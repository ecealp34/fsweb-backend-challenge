const Tweet = require('../api/tweets/tweets-model');
const db = require('../data/db-config');

beforeAll(async ()=>{
    await db.migrate.rollback();
    await db.migrate.latest();
})

beforeEach(async ()=> {
    await db.seed.run();
})

test('Sanity check', ()=> {
    expect(process.env.NODE_ENV).toBe('testing')
})

describe('____READ____', () => {
    test('[1] gets all tweets', async () => {
        const tweets = await Tweet.getAll();
        expect(tweets).toHaveLength(3);
        expect(tweets[0]).toHaveProperty('tweet_id', 1);
    })
    test('[2] gets tweet by id', async () => {
        const tweet = await Tweet.getById(1)
        expect(tweet).toHaveProperty('text');
    }) 
})
   
describe('____CREATE____', () => {
    let tweet;
    beforeEach(async ()=> {
        tweet = { tweet_id: 4, text: "I wish the ring had never come to me. I wish none of this had happened", user_id: 1 }
    })
    test('[3] returns new tweet', async () => {
        const registeredTweet = await Tweet.create(tweet);
        expect(registeredTweet.text).toBe("I wish the ring had never come to me. I wish none of this had happened")
        expect(registeredTweet.user_id).toBe(1)
    })
    test('[4] returns new tweet', async () => {
        const registeredTweet = await Tweet.create(tweet);
        expect(registeredTweet.tweet_id).not.toBe(2)
    })

describe('____UPDATE____', () => {
    let tweet;
    beforeEach(async ()=> {
        tweet = { tweet_id: 1, text: "I wish the ring had never come to me. I wish none of this had happened.", user_id: 1 }
    })
    test('[5] updates tweet', async () => {
        const updatedTweet = await Tweet.update(1,tweet);
        expect(updatedTweet).toBe(1)
    })

    test('[6] updates tweet', async () => {
        const updatedTweet = await Tweet.update(1,tweet);
        expect(updatedTweet.tweet_id).not.toBe(2)
    })
    
})

describe('____DELETE____', () => {
     test('[7] deletes tweet', async () => {
        const tweet = { tweet_id: 1, text: "I wish the ring had never come to me. I wish none of this had happened.", user_id: 1 }
        const deletedTweet = await Tweet.remove(1);
        expect(deletedTweet.id).not.toBe(1)
     })
    })
}) 