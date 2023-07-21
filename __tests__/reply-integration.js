const server = require('../api/server');
const request = require('supertest');
const db = require('../data/db-config');

beforeAll(async ()=>{
    await db.migrate.rollback();
    await db.migrate.latest();
})

beforeEach(async ()=> {
    await db.seed.run();
})

test('Sanity check', ()=> {
    expect(true).not.toBe(false)
})

const newUser = {
    username: "emre",
    password: "1234",
    role_id: "1",
    email: "emre@gmail.com"
}

const newReply = {reply_id: 4, reply: "When you look for it, there is nothing to see. When you listen for it, there is nothing to hear.", user_id: 3, tweet_id: 1}

describe('[GET] /api/replies', () => {
    test('[1] returns the correct message if request is made without token', async () => {
        let res = await request(server).get('/api/replies')
        expect(res.body.message).toMatch(/token gereklidir/i)
    }, 3000)
    test('[2] returns the correct message if request is made with wrong token', async () => {
        const res = await request(server).get('/api/replies').set('Authorization', '1')
        expect(res.body.message).toMatch(/token geçersiz/i)
    }, 3000)
    test('[3] can get the correct number of replies', async () => {
        const login = await request(server).post('/api/auth/login').send(newUser)
        const res = await request(server).get('/api/replies').set('Authorization', login.body.token)
        expect(res.body).toHaveLength(3)
    }, 3000)
})

describe('[GET] /api/replies/:id', () => {
    test('[4] can get the correct reply', async () => {
        const login = await request(server).post('/api/auth/login').send(newUser)
        res = await request(server).get('/api/replies/3').set('Authorization', login.body.token)
        expect(res.body).toMatchObject({reply_id: 3, reply: "When you look for it, there is nothing to see. When you listen for it, there is nothing to hear. When you use it, it is inexhaustible.", user_id: 3, tweet_id: 1})
    }, 3000)
    test('[5] responds with a 404 if the id does not exist', async () => {
        const login = await request(server).post('/api/auth/login').send(newUser)
        const res = await request(server).get('/api/replies/12').set('Authorization', login.body.token)
        expect(res.status).toBe(400)
    }, 3000)
    test('[6] responds a correct message if the id does not exist', async () => {
        const login = await request(server).post('/api/auth/login').send(newUser)
        res = await request(server).get('/api/replies/12').set('Authorization', login.body.token)
        expect(res.body.message).toMatch(/reply yok/i)
    }, 3000)
})

describe('[POST] /api/replies', () => {
    let token;
    beforeEach(async ()=> {
        const res = await request(server).post('/api/auth/login').send({username: "ayse", password: "1234", role_id: "1", email: "ayse@gmail.com"});
        token = res.body.token;
    })
    test('[7] creates a new reply in the database', async () => {
        res = await request(server).post('/api/replies').set('Authorization', token).send(newReply)
        expect(res.body).toMatchObject({reply_id: 4, reply: "When you look for it, there is nothing to see. When you listen for it, there is nothing to hear.", user_id: 3, tweet_id: 1})
    }, 3000)
    test('[8] responds with a 201 if a new reply is created', async () => {
        res = await request(server).post('/api/replies').set('Authorization', token).send(newReply)
        expect(res.status).toBe(201)
    }, 3000)
})

describe('[PUT] /api/replies/:id', () => {
    let token;
    beforeEach(async ()=> {
        const res = await request(server).post('/api/auth/login').send({username: "ayse", password: "1234", role_id: "1", email: "ayse@gmail.com"});
        token = res.body.token;
    })
    test('[9] updates the reply in the database', async () => {
        res = await request(server).put('/api/replies/3').set('Authorization', token).send({reply_id: 3, reply: "When you look for it, there is nothing to see. When you listen for it, there is nothing to hear.", user_id: 3, tweet_id: 1})
        let reply = await db('Replies').where('reply_id', 3).first()
        expect(reply).toMatchObject({reply_id: 3, reply: "When you look for it, there is nothing to see. When you listen for it, there is nothing to hear.", user_id: 3, tweet_id: 1})
    }, 3000)
    test('[10] responds with a 400 if the id does not exist', async () => {
        res = await request(server).put('/api/replies/12').set('Authorization', token)
        expect(res.status).toBe(400)
    }, 3000)
})

describe('[DELETE] /api/replies/:id', () => {
    test('[11] can delete the correct reply', async () => {
        let res = await request(server).post('/api/auth/login').send(newUser)
        res = await request(server).delete('/api/replies/1').set('Authorization', res.body.token)
        const reply = await db('Replies').where('reply_id', 1).first()
        expect(reply).not.toBeDefined()
    }, 3000)
    test('[12] responds with a 400 if the id does not exist', async () => {
        let res = await request(server).post('/api/auth/login').send(newUser)
        res = await request(server).delete('/api/replies/5').set('Authorization', res.body.token)
        expect(res.status).toBe(400)
    }, 3000)
    test('[13] responds a correct message if the id does not exist', async () => {
        let res = await request(server).post('/api/auth/login').send(newUser)
        res = await request(server).delete('/api/replies/12').set('Authorization', res.body.token)
        expect(res.body.message).toMatch(/reply yok/i)
    }, 3000)
})    