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


describe('[GET] /api/likes', () => {
    test('[1] returns the correct message if request is made without token', async () => {
        let res = await request(server).get('/api/likes')
        expect(res.body.message).toMatch(/token gereklidir/i)
    }, 3000)
    test('[2] returns the correct message if request is made with wrong token', async () => {
        const res = await request(server).get('/api/likes').set('Authorization', '1')
        expect(res.body.message).toMatch(/token geçersiz/i)
    }, 3000)
    test('[3] can get the correct number of likes', async () => {
        let res = await request(server).post('/api/auth/login').send(newUser)
        res = await request(server).get('/api/likes').set('Authorization', res.body.token)
        expect(res.body).toHaveLength(3)
    }, 3000)
})

describe('[GET] /api/likes/:id', () => {
    test('[4] can get the correct like', async () => {
        let res = await request(server).post('/api/auth/login').send(newUser)
        res = await request(server).get('/api/likes/1').set('Authorization', res.body.token)
        expect(res.body).toMatchObject({like_id: 1, total_number: 40, user_id: 2, tweet_id: 2})
    }, 3000)
    test('[5] responds with a 404 if the id does not exist', async () => {
        let res = await request(server).post('/api/auth/login').send(newUser)
        res = await request(server).get('/api/likes/12').set('Authorization', res.body.token)
        expect(res.status).toBe(400)
    }, 3000)
    test('[6] responds a correct message if the id does not exist', async () => {
        let res = await request(server).post('/api/auth/login').send(newUser)
        res = await request(server).get('/api/likes/12').set('Authorization', res.body.token)
        expect(res.body.message).toMatch(/like yok/i)
    }, 3000)
})

describe('[POST] /api/likes', () => {
    let token;
    beforeEach(async ()=> {
        const res = await request(server).post('/api/auth/login').send({username: "ayse", password: "1234", role_id: "1", email: "ayse@gmail.com"});
        token = res.body.token;
    })
    test('[7] creates a new like in the database', async () => {
        res = await request(server).post('/api/likes').set('Authorization', token).send({like_id: 4, total_number: 46, user_id: 3, tweet_id: 1})
        expect(res.body).toMatchObject({like_id: 4, total_number: 46, user_id: 3, tweet_id: 1})
    }, 3000)
    test('[8] responds with a 201 if a new like is created', async () => {
        res = await request(server).post('/api/likes').set('Authorization', token).send({like_id: 4, total_number: 48, user_id: 1, tweet_id: 2})
        expect(res.status).toBe(201)
    }, 3000)
})

describe('[PUT] /api/likes/:id', () => {
    let token;
    beforeEach(async ()=> {
        const res = await request(server).post('/api/auth/login').send({username: "ayse", password: "1234", role_id: "1", email: "ayse@gmail.com"});
        token = res.body.token;
      
    })
    test('[9] updates the like in the database', async () => {
        res = await request(server).put('/api/likes/1').set('Authorization', token).send({like_id: 1, total_number: 48, user_id: 2, tweet_id: 2})
        let tweet = await db('Likes').where('like_id', 1).first()
        expect(tweet).toMatchObject({like_id: 1, total_number: 48, user_id: 2, tweet_id: 2})
    }, 3000)
    test('[10] responds with a 400 if the id does not exist', async () => {
        res = await request(server).put('/api/likes/5').set('Authorization', token)
        expect(res.status).toBe(400)
    }, 3000)
})

describe('[DELETE] /api/likes/:id', () => {
    test('[11] can delete the correct like', async () => {
        let res = await request(server).post('/api/auth/login').send(newUser)
        res = await request(server).delete('/api/likes/1').set('Authorization', res.body.token)
        const like = await db('Likes').where('like_id', 1).first()
        expect(like).not.toBeDefined()
    }, 3000)
    test('[12] responds with a 400 if the id does not exist', async () => {
        let res = await request(server).post('/api/auth/login').send(newUser)
        res = await request(server).delete('/api/likes/8').set('Authorization', res.body.token)
        expect(res.status).toBe(400)
    }, 3000)
    test('[13] responds a correct message if the id does not exist', async () => {
        let res = await request(server).post('/api/auth/login').send(newUser)
        res = await request(server).delete('/api/likes/8').set('Authorization', res.body.token)
        expect(res.body.message).toMatch(/like yok/i)
    }, 3000)
})    