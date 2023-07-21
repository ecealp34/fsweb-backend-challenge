const db = require('../../data/db-config');

function getAll() {
    return db('Replies as r')
                 .join('Users as u', 'u.user_id', 'r.user_id')
                 .join('Tweets as t', 't.tweet_id', 'r.tweet_id')
                 .select(
                         'reply_id',
                         'reply',                      
                         'r.user_id',
                         'r.tweet_id'
                 )
    
}

const getById = (id) => {
    return db('Replies as r')
                .join('Users as u', 'u.user_id', 'r.user_id')
                .join('Tweets as t', 't.tweet_id', 'r.tweet_id')
                .where('reply_id', id)
                .select(
                        'reply_id',
                        'reply',                      
                        'r.user_id',
                        'r.tweet_id'
                        )
                .first()
                
}

const create = async (payload) => {
    const [ id ] = await db('Replies').insert(payload)
    return getById(id)
}

const update = (id, payload) => {
    return db('Replies')
                .where('reply_id', id)
                .update(payload)
}

const remove = (id) => {
    return db('Replies')
                .where('reply_id', id)
                .delete()
}
module.exports = { getAll, getById, create, update, remove }