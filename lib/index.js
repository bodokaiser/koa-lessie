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

  if (!options.prefix === undefined) {
    options.prefix = '/';
  }
  if (!options.compress === undefined) {
    options.compress = false;
  }
  if (!options.recompile === undefined) {
    options.recompile = false;
  }
  if (!options.index === undefined) {
    options.index = ['index.less'];
  }

  return function *(next) {
    if (this.path.indexOf(options.prefix)) return;

    var filename = this.path.replace(options.prefix, options.path);

    debug('calculated filename %s', filename);

    yield next;
  };
};