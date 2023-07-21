const db = require('../../data/db-config');

function getAll() {
    return db('Likes as l')
                 .join('Users as u', 'u.user_id', 'l.user_id')
                 .join('Tweets as t', 't.tweet_id', 'l.tweet_id')
                 .select(
                         'like_id',
                         'total_number',
                         'u.user_id',
                         't.tweet_id'
                 )
    
}

const getById = (id) => {
    return db('Likes as l')
                .join('Users as u', 'u.user_id', 'l.user_id')
                .join('Tweets as t', 't.tweet_id', 'l.tweet_id')
                .where('like_id', id)
                .select(
                        'like_id',
                        'total_number',
                        'u.user_id',
                        't.tweet_id'
                        )
                .first()
                
}

const create = async (payload) => {
    const [ id ] = await db('Likes').insert(payload)
    return getById(id)
}

const update = (id, payload) => {
    return db('Likes')
                .where('like_id', id)
                .update(payload)
}

const remove = (id) => {
    return db('Likes')
                .where('like_id', id)
                .delete()
}


module.exports = { getAll, getById, create, update, remove }
