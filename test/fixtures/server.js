const http = require('http');

const server = http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end(JSON.stringify(req.headers));
});

exports.listen = function () {
  server.listen.apply(server, arguments);
};

exports.close = function (callback) {
  server.close(callback);
};
