var path = require('path');
var less = require('less');
var cofs = require('co-fs');

module.exports = function(options) {
  if (!options.src) throw new TypeError('"src" option is required.');
  if (!options.dest) throw new TypeError('"dest" option is required.');

  var prefix = '/' + (options.prefix || '')

  var parser = new less.Parser({
    paths: [options.src]
  });

  return function* less(next) {
    if (options.served) return yield next;

    if (!this.path.endsWith('.css')) return yield next;
    if (!this.path.startsWith(prefix)) return yield next;

    var src = resolve(this.path, prefix, options.src).replace('.css', '.less');
    var dest = resolve(this.path, prefix, options.dest);

    if (yield cofs.exists(src)) {
      var less = yield cofs.readFile(src);

      var tree = yield parse(less.toString(), parser);

      yield cofs.writeFile(dest, tree.toCSS(options));

      if (options.once) options.served = true;
    }

    yield next;
  };
};

function parse(file, parser) {
  return function(callback) {
    parser.parse(file, callback);
  }
}

function resolve(pathname, search, replace) {
  var dirname  = path.dirname(pathname).replace(search, replace);
  var basename = path.basename(pathname);

  return path.join(dirname, basename);
}
