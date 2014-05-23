# koa-lessie

[less](http://lesscss.org) middleware for [koa](http://koajs.com) without
the stupid API.

## Usage

    var app = koa();

    app.use(lessie(__dirname + '/usr/styles'));

    app.listen(3000);

## Install

With our lovely [npm](https://github.com/npm/npm)

    $ npm install --save koa-lessie

## Documentation

The **lessie** middleware aims to make less more desirable to configurate then
the common used
[less.js-middleware](https://github.com/emberfeather/less.js-middleware).

### lessie(path)

    koa.use(lessie(__dirname + '/usr/styles'));

If you provide a single `path` then **lessie** will take `request.path` concat it
with the defined `path` to resolve a less file.

For example if we have the file `/usr/styles/body.less` then a request to
`/body.css` will resolve this. If there is no file found **lessie** will just
`next` for other middleware to complete.

### lessie(options)

    koa.use(lessie({
      path: '/usr/styles',
      prefix: '/stylesheets',
      compress: true,
      cache: false,
      index: ['bootstrap.less', 'index.less']
    }));

In most cases you will actually prefer to use the `options` hash as it will
allow you more control to match your existing application structure.

`options` can contain following properties:

* `path`, sets the path to the less files, required.
* `prefix`, will handle requests which path has this `prefix`, defaults to `/`.
* `compress`, will minify the less files, defaults to `false`.
* `cache`, will cache less files defaults to `false`.
* `index`, if request path points to an directory it will look for the defined
  `index`, defaults to `['index.less']`.

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
