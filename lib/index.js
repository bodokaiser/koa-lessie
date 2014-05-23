var fs       = require('fs');
var path     = require('path');
var less     = require('less');
var debug    = require('debug');
var thunkify = require('thunkify');

debug = debug('koa:lessie');

module.exports = function(options) {
  if (!options) throw new Error('We need "options" or "path" mois.');

  if (typeof options === 'string') {
    options = { path: options };
  }

  if (options.prefix === undefined) {
    options.prefix = '/';
  }
  if (options.compress === undefined) {
    options.compress = false;
  }
  if (options.recompile === undefined) {
    options.recompile = false;
  }
  if (options.index === undefined) {
    options.index = ['index.less'];
  }

  var parser = new less.Parser({
    paths: [options.path]
  });

  return function *(next) {
    if (path.extname(this.path) !== '.css') return yield next;
    if (this.path.indexOf(options.prefix)) return yield next;

    var pathname = createPathname(this, options);

    debug('pathname is %s', pathname);

    if (fs.existsSync(pathname)) {

      return debug('found less directory');
    }

    pathname += '.less';
    if (fs.existsSync(pathname)) {
      var file = yield thunkify(fs.readFile)(pathname);
      var tree = yield thunkify(parser.parse).call(parser, file.toString());

      this.type = 'css';
      this.body = tree.toCSS();

      return debug('found less file');
    }

    yield next;
  };
};

function createPathname(context, options) {
  var filename = path.basename(context.path, '.css');
  var dirname = path.dirname(context.path);

  return path.join(dirname.replace(options.prefix, options.path), filename);
}