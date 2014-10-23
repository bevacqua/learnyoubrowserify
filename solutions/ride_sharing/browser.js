module.exports = {
  save: function (key, data, done) {
    if (localStorage) {
      localStorage.setItem(key, JSON.stringify(data));
      done();
    } else {
      done(new Error('localStorage not supported'));
    }
  },
  get: function (key, done) {
    if (localStorage) {
      done(null, JSON.parse(localStorage.getItem(key)));
    } else {
      done(new Error('localStorage not supported'));
    }
  },
  remove: function (key, done) {
    if (localStorage) {
      localStorage.removeItem(key);
    }
    done();
  }
};
