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


describe('[GET] /api/tweets', () => {
    test('[1] returns the correct message if request is made without token', async () => {
        let res = await request(server).get('/api/tweets')
        expect(res.body.message).toMatch(/token gereklidir/i)
    }, 3000)
    test('[2] returns the correct message if request is made with wrong token', async () => {
        const res = await request(server).get('/api/tweets').set('Authorization', '1')
        expect(res.body.message).toMatch(/token geçersiz/i)
    }, 3000)
    test('[3] can get the correct number of tweets', async () => {
        let res = await request(server).post('/api/auth/login').send(newUser)
        res = await request(server).get('/api/tweets').set('Authorization', res.body.token)
        expect(res.body).toHaveLength(3)
    }, 3000)
})


describe('[GET] /api/tweets/:id', () => {
    test('[4] can get the correct tweet', async () => {
        let res = await request(server).post('/api/auth/login').send(newUser)
        res = await request(server).get('/api/tweets/1').set('Authorization', res.body.token)
        expect(res.body).toMatchObject({tweet_id: 1, text: "I wish the ring had never come to me. I wish none of this had happened.", user_id: 1})
    }, 3000)
    test('[5] responds with a 404 if the id does not exist', async () => {
        let res = await request(server).post('/api/auth/login').send(newUser)
        res = await request(server).get('/api/tweets/12').set('Authorization', res.body.token)
        expect(res.status).toBe(400)
    }, 3000)
    test('[6] responds a correct message if the id does not exist', async () => {
        let res = await request(server).post('/api/auth/login').send(newUser)
        res = await request(server).get('/api/tweets/12').set('Authorization', res.body.token)
        expect(res.body.message).toMatch(/tweet yok/i)
    }, 3000)
})

describe('[POST] /api/tweets', () => {
    let token;
    beforeEach(async ()=> {
        const res = await request(server).post('/api/auth/login').send({username: "ayse", password: "1234", role_id: "1", email: "ayse@gmail.com"});
        token = res.body.token;
    })
    test('[7] creates a new tweet in the database', async () => {
        res = await request(server).post('/api/tweets').set('Authorization', token).send({tweet_id: 4, text: "I wish the ring had never come to me. I wish none of this had happened", user_id: 3})
        expect(res.body).toMatchObject({tweet_id: 4, text: "I wish the ring had never come to me. I wish none of this had happened", user_id: 3})
    }, 3000)
    test('[8] responds with a 201 if a new tweet is created', async () => {
        res = await request(server).post('/api/tweets').set('Authorization', token).send({tweet_id: 4, text: "I wish the ring had never come to me. I wish none of this had happened", user_id: 3})
        expect(res.status).toBe(201)  
    }, 3000)
})

describe('[PUT] /api/tweets/:id', () => {
    let token;
    beforeEach(async ()=> {
        const res = await request(server).post('/api/auth/login').send({username: "ayse", password: "1234", role_id: "1", email: "ayse@gmail.com"});
        token = res.body.token;
    })
    test('[9] updates the tweet in the database', async () => {
        res = await request(server).put('/api/tweets/1').set('Authorization', token).send({tweet_id: 1, text: "Act without doing; work without effort.", user_id: 1})
        let tweet = await db('Tweets').where('tweet_id', 1).first()
        expect(tweet).toMatchObject({tweet_id: 1, text: "Act without doing; work without effort.", user_id: 1})
    }, 3000)
    test('[10] responds with a 400 if the id does not exist', async () => {
        res = await request(server).put('/api/tweets/12').set('Authorization', token)
        expect(res.status).toBe(400)
    }, 3000)
})

describe('[DELETE] /api/tweets/:id', () => {
    test('[11] can delete the correct tweet', async () => {
        let res = await request(server).post('/api/auth/login').send(newUser)
        res = await request(server).delete('/api/tweets/1').set('Authorization', res.body.token)
        const tweet = await db('Tweets').where('tweet_id', 1).first()
        expect(tweet).not.toBeDefined()
    }, 3000)
    test('[12] responds with a 400 if the id does not exist', async () => {
        let res = await request(server).post('/api/auth/login').send(newUser)
        res = await request(server).delete('/api/tweets/12').set('Authorization', res.body.token)
        expect(res.status).toBe(400)
    }, 3000)
    test('[13] responds a correct message if the id does not exist', async () => {
        let res = await request(server).post('/api/auth/login').send(newUser)
        res = await request(server).delete('/api/tweets/12').set('Authorization', res.body.token)
        expect(res.body.message).toMatch(/tweet yok/i)
    }, 3000)
})    