var fs        = require('fs');
var koa       = require('koa');
var lessie    = require('../lib');
var static    = require('koa-static');
var assert    = require('assert');
var supertest = require('supertest');

describe('lessie({ src, dest })', function() {

  before(function() {
    var app = koa();

    app.use(lessie({
      src: __dirname + '/styles',
      dest: __dirname + '/public'
    }));
    app.use(static(__dirname + '/public'));

    this.server = app.listen();
  });

  it('should respond "OK"', function(done) {
    supertest(this.server).get('/style.css')
      .expect(200, done);
  });

  it('should respond "Not Found"', function(done) {
    supertest(this.server).get('/bootstrap.css')
      .expect(404, done);
  });

});

describe('describe({ src, dest, once })', function() {

  before(function() {
    var app = koa();

    app.use(lessie({
      src: __dirname + '/styles',
      dest: __dirname + '/public',
      once: true
    }));
    app.use(static(__dirname + '/public'));

    this.server = app.listen();
  });

  it('should not recompile styles more than once', function(done) {
    var self = this;

    supertest(this.server).get('/style.css')
      .expect(200, function(err, res) {
        if (err) throw err;

        var stat1 = fs.statSync(__dirname + '/public/style.css');

        setTimeout(function() {
          supertest(self.server).get('/style.css')
            .expect(200, function(err, res) {
              if (err) throw err;

              var stat2 = fs.statSync(__dirname + '/public/style.css');

              assert.equal(stat1.ctime.getTime(), stat2.ctime.getTime());
              assert.equal(stat1.mtime.getTime(), stat2.mtime.getTime());

              done();
            });
        });
      }, 1000);
  });

});

describe('describe({ src, dest, minify })', function() {

  before(function() {
    var app = koa();

    app.use(lessie({
      src: __dirname + '/styles',
      dest: __dirname + '/public',
      compress: true
    }));
    app.use(static(__dirname + '/public'));

    this.server = app.listen();
  });

  it('should not contain any spaces', function(done) {
    supertest(this.server).get('/style.css')
      .expect(200, function(err, res) {
        if (err) throw err;

        assert.equal(res.text.contains(' '), false);

        done();
      });
  });

});

describe('lessie({ src, dest, prefix })', function() {

  before(function() {
    var app = koa();

    app.use(lessie({
      src: __dirname + '/styles',
      dest: __dirname + '/public/stylesheets',
      prefix: 'stylesheets'
    }));
    app.use(static(__dirname + '/public'));

    this.server = app.listen();
  });

  it('should respond "OK"', function(done) {
    supertest(this.server).get('/stylesheets/style.css')
      .expect(200, done);
  });

});

afterEach(function(done) {
  if (this.server) {
    this.server.close();
  }

  var filename = __dirname + '/public/style.css';

  fs.exists(filename, function(exists) {
    if (!exists) return done();

    fs.unlink(__dirname + '/public/style.css', done);
  });
});
