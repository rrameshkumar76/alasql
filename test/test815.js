if (typeof exports === 'object') {
  var assert = require('assert');
  var alasql = require('../dist/alasql');
}

var test = '815'; // insert test file number

describe('Test ' + test + ' - XXS or RCE from BRALITERAL', function () {

  it.only('SELECT DISTINCT ON', function () {
    var data = [{ userId: 1, name: "John" }, { userId: 2, name: "Doe" }]
    var res = alasql(`SELECT DISTINCTON userId
                      FROM ?`, [data])
    assert.deepEqual(res, [{ userId: undefined }, { userId: undefined }]);
  });


  // https://github.com/agershun/alasql/issues/1216
  it.only('SELECT DISTINCT ON using Partition', function () {
    var data = [
      { userId: 1, name: "John", date: '2021-01-01', purchaseAmount: 100 },
      { userId: 1, name: "John", date: '2020-01-01', purchaseAmount: 120 },
      { userId: 1, name: "John", date: '2019-01-01', purchaseAmount: 50 },
    ]
    var res = alasql(`SELECT userId,
                                   purchaseAmount,
                                   ROW_NUMBER() OVER (PARTITION BY userId ORDER BY purchaseAmount DESC) Corr
                            FROM ?`, [data])
    assert.deepEqual(res, [{ userId: undefined }, { userId: undefined }]);
  });

});
