const Bookmark = require('../api/bookmarks/bookmarks-model');
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
    test('[1] gets all bookmarks', async () => {
        const bookmarks = await Bookmark.getAll();
        expect(bookmarks).toHaveLength(3);
        expect(bookmarks[0]).toHaveProperty("bookmark_id", 1) 
    })
    test('[2] gets bookmark by id', async () => {
        const bookmark = await Bookmark.getById(1)
        expect(bookmark).toHaveProperty('user_id');
    })
})
   
describe('____CREATE____', () => {
    let bookmark;
    beforeEach(async ()=> {
        bookmark = {bookmark_id: 42, total_number: 42, user_id: 2, tweet_id: 2}
    })
    test('[3] returns new bookmark', async () => {
        const registeredBookmark = await Bookmark.create(bookmark);
        expect(registeredBookmark.tweet_id).toBe(2)
        expect(registeredBookmark.user_id).toBe(2)
    })
    
    test('[4] returns new bookmark', async () => {
        const registeredBookmark = await Bookmark.create(bookmark);
        expect(registeredBookmark.total_number).toBe(42)
    })

describe('____UPDATE____', () => {
    let bookmark;
    beforeEach(async ()=> {
        bookmark = {bookmark_id: 1, total_number: 40, user_id: 2, tweet_id: 3}
    })
    test('[5] updates bookmark', async () => {
        const updatedBookmark = await Bookmark.update(1,bookmark);
        expect(updatedBookmark).toBe(1)
    })
    test('[6] updates bookmark', async () => {
        const updatedBookmark = await Bookmark.update(1,bookmark);
        expect(updatedBookmark.tweet_id).not.toBe(2)
    })
})
describe('____DELETE____', () => {
    test('[7] deletes bookmark', async () => {
        const bookmark = {bookmark_id: 1, total_number: 40, user_id: 2, tweet_id: 3}
        const deletedBookmark = await Bookmark.remove(1);
        expect(deletedBookmark.id).not.toBe(1)
    })
})
}) 