exports.seed = function(knex, Promise) {
  return Promise.all([
    knex('game_users').insert(
      { win: false,
        user_id: 1,
        game_id: 1,
      }),
    knex('game_users').insert(
      { win: true,
        user_id: 2,
        game_id: 1,
      }),
    knex('game_users').insert(
      { win: true,
        user_id: 3,
        game_id: 2,
      }),
    knex('game_users').insert(
      { win: false,
        user_id: 4,
        game_id: 2,
      })
    ]);
};