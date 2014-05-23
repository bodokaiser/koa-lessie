var helper = require('./helper');

describe('lessie(path)', function() {

  before(function() {
    this.options = __dirname + '/styles';
  });

  before(helper.setup);

  it('should respond not found', function(done) {
    this.agent.get('/')
      .expect(404, done);
  });

  it('should respond not found', function(done) {
    this.agent.get('/.css')
      .expect(404, done);
  });

  it('should respond not found', function(done) {
    this.agent.get('/foobar.css')
      .expect(404, done);
  });

  it('should respond compiled stylesheet', function(done) {
    var self = this;

    helper.compile('simple.less', function(err, stylesheet) {
      if (err) throw err;

      self.agent.get('/simple.css')
        .expect('Content-Type', /css/)
        .expect('Content-Length', stylesheet.length)
        .expect(200, stylesheet, done);
    });
  });

  it('should respond compiled stylesheet with its imports', function(done) {
    var self = this;

    helper.compile('imports.less', function(err, stylesheet) {
      if (err) throw err;

      self.agent.get('/imports.css')
        .expect('Content-Type', /css/)
        .expect('Content-Length', stylesheet.length)
        .expect(200, stylesheet, done);
    });
  });

  after(helper.destroy);

});

describe('lessie(options)', function() {

  describe('lessie({ path: "/styles" })', function() {

    before(function() {
      this.options = {
        path: __dirname + '/styles'
      };
    });

    before(helper.setup);

    it('should respond not found', function(done) {
      this.agent.get('/foobar.css')
        .expect(404, done);
    });

    it('should respond compiled stylesheet', function(done) {
      var self = this;

      helper.compile('simple.less', function(err, stylesheet) {
        if (err) throw err;

        self.agent.get('/simple.css')
          .expect('Content-Type', /css/)
          .expect('Content-Length', stylesheet.length)
          .expect(200, stylesheet, done);
      });
    });

    it('should respond compiled stylesheet with its imports', function(done) {
      var self = this;

      helper.compile('imports.less', function(err, stylesheet) {
        if (err) throw err;

        self.agent.get('/imports.css')
          .expect('Content-Type', /css/)
          .expect('Content-Length', stylesheet.length)
          .expect(200, stylesheet, done);
      });
    });

    after(helper.destroy);

  });

  describe('lessie({ path: "/styles", prefix: "/stylesheets" })', function() {

    before(function() {
      this.options = {
        prefix: '/stylesheets',
        path: __dirname + '/styles'
      };
    });

    before(helper.setup);

    it('should respond not found', function(done) {
      this.agent.get('/foobar.css')
        .expect(404, done);
    });

    it('should respond not found', function(done) {
      this.agent.get('/simple.css')
        .expect(404, done);
    });

    it('should respond compiled stylesheet in directory', function(done) {
      var self = this;

      helper.compile('package/index.less', function(err, stylesheet) {
        if (err) throw err;

        self.agent.get('/stylesheets/package.css')
          .expect('Content-Type', /css/)
          .expect('Content-Length', stylesheet.length)
          .expect(200, stylesheet, done);
      });
    });

    after(helper.destroy)

  });

  describe('lessie({ path: "/styles", compress: true })', function() {

  });

  describe('lessie({ path: "/styles", recompile: true })', function() {

  });

  describe('lessie({ path: "/styles", index: ["style.css"] })', function() {


  });

});