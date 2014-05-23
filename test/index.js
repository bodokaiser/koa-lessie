var helper = require('./helper');

describe('lessie(path)', function() {

  before(function() {
    this.options = __dirname + '/styles';
  });

  before(helper.setup);

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

  it('should respond compiled stylesheet whith its imports', function(done) {
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

  beforeEach(function() {
    this.options = { path: __dirname + '/styles '};
  });

  describe('lessie({ path: "/styles" })', function() {

  });

  describe('lessie({ path: "/styles", prefix: "/stylesheets" })', function() {

    before(function() {
      this.options.prefix = '/stylesheets';
    });

  });

  describe('lessie({ path: "/styles", compress: true })', function() {

    before(function() {
      this.options.compress = true;
    });

  });

  describe('lessie({ path: "/styles", recompile: true })', function() {

    before(function() {
      this.options.recompile = true;
    });

  });

  describe('lessie({ path: "/styles", index: ["style.css"] })', function() {

    before(function() {
      this.options.index = ['style.css'];
    });

  });

});