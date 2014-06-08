# koa-lessie

[less](http://lesscss.org) middleware for [koa](http://koajs.com) without
the stupid API.

## Usage

    var app = koa();

    app.use(lessie({
      src: __dirname + '/styles',
      dest: __dirname + '/public'
    }));

    app.use(static(__dirname + '/public'));

    app.listen(3000);

## Install

With our lovely [npm](https://github.com/npm/npm)

    $ npm install --save koa-lessie

## Documentation

The **lessie** middleware aims to make less more desirable to configurate then
the standard
[less.js-middleware](https://github.com/emberfeather/less.js-middleware).

### lessie(options)

    koa.use(lessie({
      src: '/styles',
      dest: '/public/stylesheets',
      once: true,
      compress: true,
      prefix: 'stylesheets'
    }));

The `options` object can contain following properties.

* `src`, sets the path where to read the less files, required.
* `dest`, sets the path where to write the css files, required.
* `once`, if `true` middleware will only write css files once.
* `compress`, if `true` middleware will minify written css.
* `prefix`, only handles request which are prefixed with `prefix`.

## License

Copyright 2014 Bodo Kaiser <i@bodokaiser.io>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
