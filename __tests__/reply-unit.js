const Reply = require('../api/replies/replies-model');
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
    test('[1] gets all replies', async () => {
        const replies = await Reply.getAll();
        expect(replies).toHaveLength(3);
        expect(replies[0]).toHaveProperty('reply_id', 1);
    })
    
    test('[2] gets reply by id', async () => {
        const reply = await Reply.getById(1)
        expect(reply).toHaveProperty('reply');
    })
})
   
describe('____CREATE____', () => {
    let reply;
    beforeEach(async ()=> {
        reply =  {reply_id: 4, reply: "Things arise and she let's them come; things disappear and she let's them go", user_id: 2, tweet_id: 2}
    })
    test('[3] returns new reply', async () => {
        const registeredReply = await Reply.create(reply);
        expect(registeredReply.reply).toBe("Things arise and she let's them come; things disappear and she let's them go")
    })
    
    test('[4] returns new reply', async () => {
        const registeredReply = await Reply.create(reply);
        expect(registeredReply.reply_id).toBe(4)
    })

describe('____UPDATE____', () => {
    let reply;
    beforeEach(async ()=> {
        reply =  {reply_id: 1, reply: "Things arise and she let's them come; things disappear and she let's them go.", user_id: 2, tweet_id: 2}
    })
    test('[5] updates reply', async () => {
        const updatedReply = await Reply.update(1,reply);
        expect(updatedReply).toBe(1)
    })

    test('[6] updates reply', async () => {
        const updatedReply = await Reply.update(1,reply);
        expect(updatedReply.tweet_id).not.toBe(2)
    })
    
})
describe('____DELETE____', () => {
    test('[7] deletes reply', async () => {
        const reply =  {reply_id: 1, reply: "Things arise and she let's them come; things disappear and she let's them go.", user_id: 2, tweet_id: 2}
        const deletedReply = await Reply.remove(1);
        expect(deletedReply.id).not.toBe(1)
    })
})
}) 