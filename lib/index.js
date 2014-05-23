var fs    = require('fs');
var path  = require('path');
var less  = require('less');
var debug = require('debug');

debug = debug('koa-lessie');

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

  return function *(next) {
    if (path.extname(this.path) !== '.css') return yield next;
    if (this.path.indexOf(options.prefix)) return yield next;

    var pathname = createPathname(this, options);

    debug('pathname is %s', pathname);

    if (fs.existsSync(pathname)) {

      return debug('found less directory');
    }
    if (fs.existsSync(pathname + '.less')) {
      var file = yield readFile(pathname + '.less');
      var style = yield render(file.toString());

      this.type = 'css';
      this.body = style;

      return debug('found less file');
    }

    yield next;
  };
};

function render(file) {
  return function(callback) {
    less.render(file, callback);
  }
}

function readFile(path) {
  return function(callback) {
    fs.readFile(path, callback);
  }
}

function createPathname(context, options) {
  var filename = path.basename(context.path, '.css');
  var dirname = path.dirname(context.path);

  return path.join(dirname.replace(options.prefix, options.path), filename);
}