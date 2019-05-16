'use strict';

const _ = require('lodash');

exports = module.exports = function (db) {
  const file = db.serverAtLeast('11') ? 'functions.sql' : 'functions-legacy.sql';

  if (db.loader.excludeFunctions) { return db.$p.resolve([]); }

  return db.instance.query(db.loader.queryFiles[file], db.loader).then(fns => {
    return fns.map(fn => {
      const params = _.times(fn.paramCount, i => `$${i + 1}`).join(',');

      if (fn.kind === 'p') {
        fn.sql = `CALL "${fn.schema}"."${fn.name}"(${params})`;
      } else {
        fn.sql = `SELECT * FROM "${fn.schema}"."${fn.name}"(${params})`;
      }

      return fn;
    });
  });
};
