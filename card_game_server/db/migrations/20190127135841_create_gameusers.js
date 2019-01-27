
exports.up = function(knex, Promise) {
  return knex.schema.createTable('game_users', function (table) {
        table.increments('id').primary();
        table.boolean('win').notNull();
        table.integer('user_id').notNull();
        table.integer('game_id').notNull();

        table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
        table.foreign('game_id').references('id').inTable('games').onDelete('CASCADE');
      });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('game_users');
};
