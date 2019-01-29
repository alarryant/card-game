exports.seed = function(knex, Promise) {
  return Promise.all([
    knex('games').insert(
      { type: 'blackjack',
        date: '2019-02-15',
      }),
    knex('games').insert(
      { type: 'blackjack',
        date: '2019-02-16',
      })
    ]);
};