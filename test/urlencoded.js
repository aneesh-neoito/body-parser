
var assert = require('assert');
var http = require('http');
var request = require('supertest');

var bodyParser = require('..');

describe('bodyParser.urlencoded()', function(){
  var server
  before(function(){
    server = createServer()
  })

  it('should support all http methods', function(done){
    request(server)
    .get('/')
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .set('Content-Length', 'user=tobi'.length)
    .send('user=tobi')
    .expect(200, '{"user":"tobi"}', done)
  })

  it('should parse x-www-form-urlencoded', function(done){
    request(server)
    .post('/')
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .send('user=tobi')
    .expect(200, '{"user":"tobi"}', done)
  })

  describe('with type option', function(){
    var server;
    before(function(){
      server = createServer({ type: 'application/vnd+x-www-form-urlencoded' })
    })

    it('should parse for custom type', function(done){
      request(server)
      .post('/')
      .set('Content-Type', 'application/vnd+x-www-form-urlencoded')
      .send('user=tobi')
      .expect(200, '{"user":"tobi"}', done)
    })

    it('should ignore standard type', function(done){
      request(server)
      .post('/')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send('user=tobi')
      .expect(200, '{}', done)
    })
  })
})

function createServer(opts){
  var _bodyParser = bodyParser.urlencoded(opts)

  return http.createServer(function(req, res){
    _bodyParser(req, res, function(err){
      res.statusCode = err ? (err.status || 500) : 200;
      res.end(err ? err.message : JSON.stringify(req.body));
    })
  })
}
