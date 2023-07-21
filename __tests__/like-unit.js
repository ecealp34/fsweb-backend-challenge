const Like = require('../api/likes/likes-model');
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
    test('[1] gets all likes', async () => {
        const likes = await Like.getAll();
        expect(likes).toHaveLength(3);
        expect(likes[1]).toHaveProperty('like_id', 2);
    })
    
    test('[2] gets likes by id', async () => {
        const like = await Like.getById(1)
        expect(like).toHaveProperty('total_number');
    })
    
})
   
describe('____CREATE____', () => {
    let like;
    beforeEach(async ()=> {
        like =  {like_id: 50, total_number: 50, user_id: 2, tweet_id: 2}
    })
    test('[3] returns new like', async () => {
        const registeredLike = await Like.create(like);
        expect(registeredLike.total_number).toBe(50)
    })
    
    test('[4] returns new like', async () => {
        const registeredLike = await Like.create(like);
        expect(registeredLike.user_id).toBe(2)
    })

describe('____UPDATE____', () => {
    let like;
    beforeEach(async ()=> {
        like =  {like_id: 1, total_number: 40, user_id: 2, tweet_id: 2}
    })
    test('[5] updates like', async () => {
        const updatedLike = await Like.update(1,like);
        expect(updatedLike).toBe(1)
    })

    test('[6] updates like', async () => {
        const updatedLike = await Like.update(1,like);
        expect(updatedLike.user_id).not.toBe(3)
    })
    
})

describe('____DELETE____', () => {
    test('[7] deletes like', async () => {
        const like =  {like_id: 1, total_number: 40, user_id: 2, tweet_id: 2}
        const deletedLike = await Like.remove(1);
        expect(deletedLike.id).not.toBe(1)
    })
})
}) 