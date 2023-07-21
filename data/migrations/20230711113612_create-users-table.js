/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable("Roles", tbl => {
    tbl.increments("role_id")
    tbl.string("name", 32).notNullable()
  })
  .createTable("Users", tbl => {
    tbl.increments("user_id")
    tbl.string("username", 128).notNullable().unique()
    tbl.string("password", 128).notNullable()
    tbl.string("email").notNullable().unique() 
    tbl.integer("role_id")
    .unsigned()
    .notNullable()
    .defaultTo(2)
    .references("role_id")
    .inTable("Roles")
    .onDelete("CASCADE")
    .onUpdate("CASCADE");
  })
  .createTable("Tweets", tbl => {
    tbl.increments("tweet_id")
    tbl.string("text").notNullable()
    tbl.timestamp("created_at").defaultTo(knex.fn.now())
    tbl.integer("user_id")
        .unsigned()
        .notNullable()
        .references("user_id")
        .inTable("Users")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
  })
  .createTable("Likes", tbl => {
    tbl.increments("like_id")
    tbl.timestamp("created_at").defaultTo(knex.fn.now())
    tbl.decimal("total_number").notNullable()
    tbl.integer("user_id")
        .unsigned()
        .notNullable()
        .references("user_id")
        .inTable("Users")
        .onDelete("CASCADE")
        .onUpdate("CASCADE")
    tbl.integer("tweet_id")
        .unsigned()
        .notNullable()
        .references("tweet_id")
        .inTable("Tweets")
        .onDelete("CASCADE")
        .onUpdate("CASCADE")
  })
  .createTable("Bookmarks", tbl => {
    tbl.increments("bookmark_id")
    tbl.timestamp("created_at").defaultTo(knex.fn.now())
    tbl.decimal("total_number").notNullable()
    tbl.integer("user_id")
        .unsigned()
        .notNullable()
        .references("user_id")
        .inTable("Users")
        .onDelete("CASCADE")
        .onUpdate("CASCADE")
    tbl.integer("tweet_id")
        .unsigned()
        .notNullable()
        .references("tweet_id")
        .inTable("Tweets")
        .onDelete("CASCADE")
        .onUpdate("CASCADE")
  })
  .createTable("Replies", tbl => {
    tbl.increments("reply_id")
    tbl.string("reply").notNullable()
    tbl.timestamp("created_at").defaultTo(knex.fn.now())
    tbl.integer("user_id")
        .unsigned()
        .notNullable()
        .references("user_id")
        .inTable("Users")
        .onDelete("CASCADE")
        .onUpdate("CASCADE")
    tbl.integer("tweet_id")
        .unsigned()
        .notNullable()
        .references("tweet_id")
        .inTable("Tweets")
        .onDelete("CASCADE")
        .onUpdate("CASCADE")
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists("Replies")
                      .dropTableIfExists("Bookmarks")
                      .dropTableIfExists("Likes")
                      .dropTableIfExists("Tweets")  
                      .dropTableIfExists("Users")
                      .dropTableIfExists("Roles")

                      
};
