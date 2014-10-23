var fs = require('fs');
var sanitize = require('sanitize-filename');

module.exports = {
  save: function (key, data, done) {
    fs.writeFile('store-' + sanitize(key), JSON.stringify(data), done);
  },
  get: function (key, done) {
    fs.readFile('store-' + sanitize(key), 'utf8', function (err, data) {
      done(null, data ? JSON.parse(data) : void 0);
    });
  },
  remove: function (key, done) {
    fs.unlink('store-' + sanitize(key), done);
  }
};
