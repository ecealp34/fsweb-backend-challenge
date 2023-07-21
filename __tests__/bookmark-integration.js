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


describe('[GET] /api/bookmarks', () => {
    test('[1] returns the correct message if request is made without token', async () => {
        let res = await request(server).get('/api/bookmarks')
        expect(res.body.message).toMatch(/token gereklidir/i)
    }, 3000)
    test('[2] returns the correct message if request is made with wrong token', async () => {
        const res = await request(server).get('/api/bookmarks').set('Authorization', '1')
        expect(res.body.message).toMatch(/token geçersiz/i)
    }, 3000)
    test('[3] can get the correct number of bookmarks', async () => {
        let res = await request(server).post('/api/auth/login').send(newUser)
        res = await request(server).get('/api/bookmarks').set('Authorization', res.body.token)
        expect(res.body).toHaveLength(3)
    }, 3000)
})


describe('[GET] /api/bookmarks/:id', () => {
    test('[4] can get the correct bookmark', async () => {
        let res = await request(server).post('/api/auth/login').send(newUser)
        res = await request(server).get('/api/bookmarks/3').set('Authorization', res.body.token)
        expect(res.body).toMatchObject({bookmark_id: 3, total_number: 30, user_id: 3, tweet_id: 2})
    }, 3000)
    test('[5] responds with a 400 if the id does not exist', async () => {
        let res = await request(server).post('/api/auth/login').send(newUser)
        res = await request(server).get('/api/bookmarks/8').set('Authorization', res.body.token)
        expect(res.status).toBe(400)
    }, 3000)
    test('[6] responds a correct message if the id does not exist', async () => {
        let res = await request(server).post('/api/auth/login').send(newUser)
        res = await request(server).get('/api/bookmarks/12').set('Authorization', res.body.token)
        expect(res.body.message).toMatch(/bookmark yok/i)
    }, 3000)
})

describe('[POST] /api/bookmarks', () => {
    let token;
    beforeEach(async ()=> {
        const res = await request(server).post('/api/auth/login').send({username: "ayse", password: "1234", role_id: "1", email: "ayse@gmail.com"});
        token = res.body.token;
    })
    test('[7] creates a new bookmark in the database', async () => {
        res = await request(server).post('/api/bookmarks').set('Authorization', token).send({bookmark_id: 4, total_number: 31, user_id: 3, tweet_id: 2})
        expect(res.body).toMatchObject({bookmark_id: 4, total_number: 31, user_id: 3, tweet_id: 2})
    }, 3000)
    test('[8] responds with a 201 if a new bookmark is created', async () => {
        res = await request(server).post('/api/bookmarks').set('Authorization', token).send({bookmark_id: 4, total_number: 31, user_id: 3, tweet_id: 2})
        expect(res.status).toBe(201)
    }, 3000)
})


describe('[PUT] /api/bookmarks/:id', () => {
    let token;
    beforeEach(async ()=> {
        const res = await request(server).post('/api/auth/login').send({username: "ayse", password: "1234", role_id: "1", email: "ayse@gmail.com"});
        token = res.body.token;
      
    })
    test('[9] updates the bookmark in the database', async () => {
        res = await request(server).put('/api/bookmarks/1').set('Authorization', token).send({bookmark_id: 1, total_number: 42, user_id: 2, tweet_id: 3})
        let bookmark = await db('Bookmarks').where('bookmark_id', 1).first()
        expect(bookmark).toMatchObject({bookmark_id: 1, total_number: 42, user_id: 2, tweet_id: 3})
    }, 3000)
    test('[10] responds with a 400 if the id does not exist', async () => {
        res = await request(server).put('/api/bookmarks/12').set('Authorization', token)
        expect(res.status).toBe(400)
    }, 3000)
})


describe('[DELETE] /api/bookmarks/:id', () => {
    test('[11] can delete the correct bookmark', async () => {
        let res = await request(server).post('/api/auth/login').send(newUser)
        res = await request(server).delete('/api/bookmarks/1').set('Authorization', res.body.token)
        const bookmark = await db('Bookmarks').where('bookmark_id', 1).first()
        expect(bookmark).not.toBeDefined()
    }, 3000)
    test('[12] responds with a 400 if the id does not exist', async () => {
        let res = await request(server).post('/api/auth/login').send(newUser)
        res = await request(server).delete('/api/bookmarks/5').set('Authorization', res.body.token)
        expect(res.status).toBe(400)
    }, 3000)
    test('[13] responds a correct message if the id does not exist', async () => {
        let res = await request(server).post('/api/auth/login').send(newUser)
        res = await request(server).delete('/api/bookmarks/12').set('Authorization', res.body.token)
        expect(res.body.message).toMatch(/bookmark yok/i)
    }, 3000)
})    