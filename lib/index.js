var fs       = require('fs');
var path     = require('path');
var less     = require('less');
var debug    = require('debug');
var thunkify = require('thunkify');

debug = debug('koa:lessie');

module.exports = function(options) {
  if (!options) throw new Error('We need "options" or "path".');
  if (typeof options === 'string') options = { path: options };

  options.index = options.index || ['index.less'];

  options.prefix = options.prefix || '/';
  if (options.prefix.indexOf('/')) options.prefix = '/' + options.prefix;

  options.cache = options.cache || false;
  options.compress = options.compress || false;

  var cache = {};
  var parser = new less.Parser({
    paths: [options.path]
  });

  return function *(next) {
    debug('request to path %s', this.path);
    // we are only interested in requests which have the ending ".css"
    // and which match our defined prefix
    if (this.path.indexOf(options.prefix)) return yield next;
    if (path.extname(this.path) !== '.css') return yield next;

    // if we have cache enabled and already a file under the path
    // then why not return this immediatly?
    if (options.cache && cache.hasOwnProperty(this.path)) {
      this.type = 'css';
      this.body = cache[this.path];

      return debug('using cached stylesheet');
    }

    // lets transform the request path to a fs path
    var pathname = resolvePathname(this, options);

    debug('resolving file at path %s', pathname);
    // if our pathname exists compile file and proceed
    if (fs.existsSync(pathname)) {
      yield compile(cache, parser, pathname, options);

      return debug('resolved directly less file %s', pathname);
    }

    pathname = pathname.replace('.less', '');

    debug('resolving dir at path %s', pathname);
    // else check if the request was on a directory
    if (fs.existsSync(pathname)) {
      // stop with the pathname which actually exists
      var found = options.index.some(function(index) {
        pathname = path.join(pathname, index);

        return fs.existsSync(pathname);
      });
      // if some does not return anything we should go on
      if (found) {
        yield compile(cache, parser, pathname, options);

        return debug('resolved through directory less file %s', pathname);
      }
    }

    // if nothing found just go on
    yield next;
  };
};

function compile(cache, parser, pathname, options) {
  return function *() {
    var file = yield thunkify(fs.readFile)(pathname);
    var tree = yield thunkify(parser.parse).call(parser, file.toString());

    this.type = 'css';
    this.body = tree.toCSS(options);

    if (options.cache) {
      cache[this.path] = this.body;
    }
  }
}

function resolvePathname(context, options) {
  var filename = path.basename(context.path, '.css');
  var dirname = path.dirname(context.path).replace(options.prefix, options.path);

  return path.join(dirname, filename + '.less');
}
