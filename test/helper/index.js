var fs        = require('fs');
var koa       = require('koa');
var http      = require('http');
var less      = require('less');
var lessie    = require('../../lib');
var supertest = require('supertest');

exports.setup = function() {
  this.app = koa().use(lessie(this.options));

  this.server = http.createServer(this.app.callback()).listen();

  this.agent = supertest.agent(this.server);
};

exports.destroy = function() {
  this.server.close();
};

exports.compile = function(filename, callback) {
  var parser = new (less.Parser)({
    paths: [__dirname + '/../styles'],
    filename: filename
  });

  fs.readFile(__dirname + '/../styles/' + filename, function(err, file) {
    if (err) return callback(err);

    parser.parse(file.toString(), function(err, tree) {
      if (err) return callback(err);

      callback(null, tree.toCSS())
    });
  });
};