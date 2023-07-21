const User = require('../api/users/users-model');
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
    test('[1] gets all users', async () => {
        const users = await User.getAll();
        expect(users).toHaveLength(3);
        expect(users[1]).toHaveProperty('username', 'mert');
    })
    test('[2] gets user by id', async () => {
        const user = await User.getById(1)
        expect(user).toHaveProperty('username', 'emre');
        expect(user).toHaveProperty('email');
    })
    test('[3] gets user by email', async () => {
        const user = await User.getByEmail("mert@gmail.com")
        expect(user).toHaveProperty('username', 'mert');
        expect(user.email).toMatch(/mert/i);
    })
})
   
describe('____CREATE____', () => {
    let user;
    beforeEach(async ()=> {
        user = { user_id: '5', username: 'hakan', password: '$2a$08$gf.J2MtQZfprIAya3XDbu.aPie/oLE5evYbWJNvKbhXRQZ9.DR1l.', email: "hakan@gmail.com", role_id: "1"}
    })
    test('[4] returns new user', async () => {
        const registeredUser = await User.create(user);
        expect(registeredUser.username).toBe("hakan")
        expect(registeredUser.user_id).toBe(5)
    })
    test('[5] returns new user', async () => {
        const registeredUser = await User.create(user);
        expect(registeredUser.role_name).not.toBe("User")
     })

describe('____UPDATE____', () => {
    test('[6] updates user', async () => {
        const user = { username: 'hakan', password: '$2a$08$gf.J2MtQZfprIAya3XDbu.aPie/oLE5evYbWJNvKbhXRQZ9.DR1l.', email: "hakan@gmail.com", role_id: "1"}
        const updatedUser = await User.update(1,user);
        expect(updatedUser).toBe(1)
    })
    test('[7] updates user', async () => {
        const user = { username: 'hakan', password: '$2a$08$gf.J2MtQZfprIAya3XDbu.aPie/oLE5evYbWJNvKbhXRQZ9.DR1l.', email: "hakan@gmail.com", role_id: "1"}
        const updatedUser = await User.update(1,user);
        expect(updatedUser.username).not.toBe("mert")
    })  
})

describe('____DELETE____', () => {
    test('[8] deletes user', async () => {
        const user = { username: 'hakan', password: '$2a$08$gf.J2MtQZfprIAya3XDbu.aPie/oLE5evYbWJNvKbhXRQZ9.DR1l.', email: "hakan@gmail.com", role_id: "1"}
        const deletedUser = await User.remove(1);
        expect(deletedUser.id).not.toBe(1)
    })
})
}) 