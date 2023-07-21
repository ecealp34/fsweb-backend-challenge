const db = require('../../data/db-config');

const getAll = () => {
    return db('Users as u')
                .join('Roles as r', 'u.role_id', 'r.role_id')
                .select(
                        'user_id',
                        'username',
                        'email',
                        'u.role_id',
                        'r.name as role_name'
                )
}

const getById = (id) => {
    return db('Users as u')
                .join('Roles as r', 'u.role_id', 'r.role_id')
                .where('user_id', id)
                .select(
                        'user_id',
                        'username',
                        'email',
                        'u.role_id',
                        'r.name as role_name'
                        )
                .first()
                
}


const getByEmail = (email) => {
    return db('Users as u')
                .join('Roles as r', 'u.role_id', 'r.role_id')
                .where('email', email)
                .select(
                        'user_id',
                        'username',
                        'email',
                        'password',
                        'u.role_id',
                        'r.name as role_name')
                .first()
               
}

const create = async (payload) => {
    const [ id ] = await db('Users').insert(payload)
    return getById(id)
}

const update = (id, payload) => {
    return db('Users')
                .where('user_id', id)
                .update(payload)
}

const remove = (id) => {
    return db('Users')
                .where('user_id', id)
                .delete()
}


module.exports = {
    getAll,
    getById,
    getByEmail,
    create,
    update,
    remove
}