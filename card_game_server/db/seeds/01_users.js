exports.seed = function(knex, Promise) {
  return Promise.all([
    knex('users').insert(
      { email: 'angela@example.com',
        password: '1234',
        username: 'angela'
      }),
    knex('users').insert(
      { email: 'peter@example.com',
        password: '1234',
        username: 'peter'
      }),
    knex('users').insert(
      { email: 'jenny@example.com',
        password: '1234',
        username: 'jenny'
      }),
    knex('users').insert(
      { email: 'monica@example.com',
        password: '1234',
        username: 'monica'
      })
    ]);
};