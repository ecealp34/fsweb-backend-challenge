const db = require('../../data/db-config');

function getAll() {
    return db('Tweets as t')
                 .join('Users as u', 'u.user_id', 't.user_id')
                 .select(
                         'tweet_id',
                         'text',
                         'email',
                        'u.user_id'
                 )
    
}

const getById = (id) => {
    return db('Tweets as t')
                .join('Users as u', 'u.user_id', 't.user_id')
                .where('tweet_id', id)
                .select(
                        'tweet_id',
                        'text',
                        'email',
                        'u.user_id',
                        )
                .first()
                
}

const create = async (payload) => {
    const [ id ] = await db('Tweets').insert(payload)
    return getById(id)
}

const update = (id, payload) => {
    return db('Tweets')
                .where('tweet_id', id)
                .update(payload)
}

const remove = (id) => {
    return db('Tweets')
                .where('tweet_id', id)
                .delete()
}


module.exports = { getAll, getById, create, update, remove }
