var fs     = require('fs');
var koa    = require('koa');
var lessie = require('../../lib');

var app = koa();

app.use(lessie(__dirname));

app.use(function *(next) {
  if (this.path !== '/') return yield next;

  this.type = 'html';
  this.body = fs.createReadStream(__dirname + '/index.html');
});

app.listen(3000);