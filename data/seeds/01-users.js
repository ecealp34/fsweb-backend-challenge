/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */

const users = [
  {user_id: 1, username: "emre", password: "$2a$08$gf.J2MtQZfprIAya3XDbu.aPie/oLE5evYbWJNvKbhXRQZ9.DR1l.", email: "emre@gmail.com", role_id: 1},
  {user_id: 2, username: "mert", password: "$2a$08$gf.J2MtQZfprIAya3XDbu.aPie/oLE5evYbWJNvKbhXRQZ9.DR1l.", email: "mert@gmail.com", role_id: 2},
  {user_id: 3, username: "ayse", password: "$2a$08$gf.J2MtQZfprIAya3XDbu.aPie/oLE5evYbWJNvKbhXRQZ9.DR1l.", email: "ayse@gmail.com", role_id: 1}
]

const tweets = [
  {tweet_id: 1, text: "I wish the ring had never come to me. I wish none of this had happened.", user_id: 1},
  {tweet_id: 2, text: "I think we should get off the road. Get off the road! Quick!", user_id: 1},
  {tweet_id: 3, text: "Act without doing; work without effort.", user_id: 3}
]

const likes = [
  {like_id: 1, total_number: 40, user_id: 2, tweet_id: 2},
  {like_id: 2, total_number: 80, user_id: 1, tweet_id: 3},
  {like_id: 3, total_number: 130, user_id: 3, tweet_id: 1}
]

const bookmarks = [
  {bookmark_id: 1, total_number: 40, user_id: 2, tweet_id: 3},
  {bookmark_id: 2, total_number: 20, user_id: 1, tweet_id: 3},
  {bookmark_id: 3, total_number: 30, user_id: 3, tweet_id: 2}
]

const replies = [
  {reply_id: 1, reply: "Things arise and she let's them come; things disappear and she let's them go.", user_id: 2, tweet_id: 2},
  {reply_id: 2, reply: "A good travel has no fixed plans and is not intent upon arriving. A good artist lets his intuition lead him where ever it wants.", user_id: 1, tweet_id: 3},
  {reply_id: 3, reply: "When you look for it, there is nothing to see. When you listen for it, there is nothing to hear. When you use it, it is inexhaustible.", user_id: 3, tweet_id: 1}
]

exports.seed = async function(knex) {
  
  await knex('Replies').truncate()
  await knex('Bookmarks').truncate()
  await knex('Likes').truncate()
  await knex('Tweets').truncate()
  await knex('Users').truncate()
  await knex('Roles').truncate()

  await knex('Roles').insert([
    {role_id: 1, name: 'Author'},
    {role_id: 2, name: 'User'}
  ]);
  await knex('Users').insert(users);
  await knex('Tweets').insert(tweets);
  await knex('Likes').insert(likes);
  await knex('Bookmarks').insert(bookmarks);
  await knex('Replies').insert(replies);
};
