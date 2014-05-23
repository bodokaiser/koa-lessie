var fs     = require('fs');
var koa    = require('koa');
var lessie = require('../../lib');

var app = koa();

app.use(lessie(__dirname));

app.use(function *(next) {
  yield this.body = readFile(__dirname + '/index.html');
});

app.listen(3000);

function readFile(path) {
  return function(callback) {
    fs.readFile(path, callback);
  }
}