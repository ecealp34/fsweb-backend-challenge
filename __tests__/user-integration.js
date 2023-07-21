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

const invalidUser = {
    username: "melisry",
    password: "1234",
    role_id: "1",
    email: "melis@gmail.com"
}


describe('____AUTH____', () => {
    describe('[POST] /api/auth/login', () => {
        test('[1] returns a correct message on valid credentials', async () => {
            const res = await request(server).post('/api/auth/login').send(newUser)
            expect(res.body.message).toMatch(/tekrar hoşgeldin/i)
        }, 3000)
        test('[2] returns a correct message and status code if the credentials are invalid', async () => {
            let res = await request(server).post('/api/auth/login').send(invalidUser)
            expect(res.body.message).toMatch(/ersiz kimlik/i)
            expect(res.status).toBe(401)
          }, 3000)
        test('[3] returns a correct message and status code if the credentials are invalid', async () => {
            res = await request(server).post('/api/auth/login').send({username: "melis", role_id: "1"})
            expect(res.body.message).toMatch(/alanlar eksik/i)
            expect(res.status).toBe(400)
        }, 3000)
    })

    describe('[POST] /api/auth/register', () => {
        test('[4] return hashed password ', async () => {
            await request(server).post('/api/auth/register').send(newUser)
            let registeredUser = await db('Users').where('username', newUser.username).first();
            expect(registeredUser.password).not.toBe('1234')
        })
    },3000)
        test('[5] return a correct message and status code if register successfully ', async () => {
            const res = await request(server).post('/api/auth/register').send({ username: "melis", password: "1234", role_id: "1", email: "melis@gmail.com"})
            expect(res.body.message).toMatch(/hoşgeldin/i)
            expect(res.status).toBe(201)
    },3000)
})

    describe('[GET] /api/users', () => {
        test('[6] returns the correct message if request is made without token', async () => {
            let res = await request(server).get('/api/users')
            expect(res.body.message).toMatch(/token gereklidir/i)
        }, 3000)
        test('[7] returns the correct message if request is made with wrong token', async () => {
            const res = await request(server).get('/api/users').set('Authorization', 'melis')
            expect(res.body.message).toMatch(/token geçersiz/i)
        }, 3000)
        test('[8] returns the correct message if request is made with correct token', async () => {
            let res = await request(server).post('/api/auth/login').send(newUser)
            res = await request(server).get('/api/users').set('Authorization', res.body.token)
            expect(res.body).toMatchObject([{"email": "emre@gmail.com", "role_id": 1, "role_name": "Author", "user_id": 1, "username": "emre"}, {"email": "mert@gmail.com", "role_id": 2, "role_name": "User", "user_id": 2, "username": "mert"}, {"email": "ayse@gmail.com", "role_id": 1, "role_name": "Author", "user_id": 3, "username": "ayse"}])
        }, 3000)
    })


    describe('[GET] /api/users/:id', () => {
        test('[9] can get the correct user', async () => {
            let res = await request(server).post('/api/auth/login').send(newUser)
            res = await request(server).get('/api/users/1').set('Authorization', res.body.token)
            expect(res.body).toHaveProperty("username", "emre")
        }, 3000)
        test('[10] responds with a 404 if the id does not exist', async () => {
            let res = await request(server).post('/api/auth/login').send(newUser)
            res = await request(server).get('/api/users/12').set('Authorization', res.body.token)
            expect(res.status).toBe(400)
        }, 3000)
        test('[11] responds a correct message if the id does not exist', async () => {
            let res = await request(server).post('/api/auth/login').send(newUser)
            res = await request(server).get('/api/users/12').set('Authorization', res.body.token)
            expect(res.body.message).toMatch(/kullanıcı yok/i)
        }, 3000)
    })

    describe('[PUT] /api/users/:id', () => {
        let token;
        beforeEach(async ()=> {
            const res = await request(server).post('/api/auth/login').send({username: "ayse", password: "1234", role_id: "1", email: "ayse@gmail.com"});
            token = res.body.token;
        })
        test('[12] updates the user in the database', async () => {
            res = await request(server).put('/api/users/1').set('Authorization', token).send({username: "emre", password: "$2a$08$gf.J2MtQZfprIAya3XDbu.aPie/oLE5evYbWJNvKbhXRQZ9.DR1l.", role_id: 2, email: "emre@gmail.com"})
            let user = await db('Users').where('user_id', 1).first()
            expect(user).toMatchObject({username: "emre", password: "$2a$08$gf.J2MtQZfprIAya3XDbu.aPie/oLE5evYbWJNvKbhXRQZ9.DR1l.", role_id: 2, email: "emre@gmail.com"})
        }, 3000)
        test('[13] responds with a 400 if the id does not exist', async () => {
            res = await request(server).put('/api/users/111').set('Authorization', token)
            expect(res.status).toBe(400)
        }, 3000)
    })
    
    describe('[DELETE] /api/users/:id', () => {
        test('[14] can delete the correct user', async () => {
            let res = await request(server).post('/api/auth/login').send(newUser)
            res = await request(server).delete('/api/users/1').set('Authorization', res.body.token)
            const user = await db('Users').where('user_id', 1).first()
            expect(user).not.toBeDefined()
        }, 3000)
        test('[15] responds with a 400 if the id does not exist', async () => {
            let res = await request(server).post('/api/auth/login').send(newUser)
            res = await request(server).delete('/api/users/12').set('Authorization', res.body.token)
            expect(res.status).toBe(400)
        }, 3000)
        test('[16] responds a correct message if the id does not exist', async () => {
            let res = await request(server).post('/api/auth/login').send(newUser)
            res = await request(server).delete('/api/users/12').set('Authorization', res.body.token)
            expect(res.body.message).toMatch(/kullanıcı yok/i)
        }, 3000)
    })    
