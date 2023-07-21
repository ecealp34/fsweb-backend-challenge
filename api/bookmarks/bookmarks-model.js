const db = require('../../data/db-config');

async function getAll() {
    let bookmarks = await db('Bookmarks as b');
    let mappedBookmarks = bookmarks.map(x => {
        return { 
            ...x, bookmark_id: x.bookmark_id
        }
    });
    return mappedBookmarks;
                 
}

async function getById(id)  {
    let bookmark = await db('Bookmarks as b').where('bookmark_id', id).first();
    return bookmark;      
}

const create = async (payload) => {
    const [ id ] = await db('Bookmarks').insert(payload)
    return getById(id)
}

const update = (id, payload) => {
    return db('Bookmarks')
                .where('bookmark_id', id)
                .update(payload)
}

const remove = (id) => {
    return db('Bookmarks')
                .where('bookmark_id', id)
                .delete()
}


module.exports = { getAll, getById, create, update, remove }