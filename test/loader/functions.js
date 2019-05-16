'use strict';

const loader = require('../../lib/loader/functions');

describe('functions', function () {
  let db;

  before(function* () {
    db = yield resetDb('functions');
  });

  after(function () {
    return db.instance.$pool.end();
  });

  it('should query for a list of functions and procedures', function* () {
    const functions = yield loader(db);

    assert.isArray(functions);
    assert.isTrue(functions.length > 0);
    assert.isTrue(functions[0].hasOwnProperty('name'));
    assert.isTrue(functions[0].hasOwnProperty('schema'));
    assert.isTrue(functions[0].hasOwnProperty('sql'));
    assert.isTrue(functions.some(f => f.kind === 'p'));
  });

  describe('server < 11', function () {
    let realServerVersion;

    before(function () {
      realServerVersion = db.serverVersion;

      db.serverVersion = '10.2';
    });

    after(function () {
      db.serverVersion = realServerVersion;
    });

    it('should not recognize procs if the server is too old', function* () {
      const functions = yield loader(db);

      assert.isArray(functions);
      assert.isTrue(functions.length > 0);
      assert.isTrue(functions[0].hasOwnProperty('name'));
      assert.isTrue(functions[0].hasOwnProperty('schema'));
      assert.isTrue(functions[0].hasOwnProperty('sql'));
      assert.isTrue(functions.some(f => f.kind === undefined));
    });
  });
});
