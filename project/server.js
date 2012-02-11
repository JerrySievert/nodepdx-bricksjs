var bricks   = require('bricks'),
    settings = require('./settings.json'),
    wiki     = require('./lib/wiki');

var appServer = new bricks.appserver();

// only add request to /wiki routes
appServer.addRoute("^/wiki/.+", appServer.plugins.request, { section: "pre" });

// if this is "/", redirect to a base wiki page
appServer.addRoute("^/$", function (request, response) {
  response.statusCode(301);
  response.setHeader('Location', '/wiki/index');
  response.final();
});

appServer.addRoute(".+", appServer.plugins.filehandler, { basedir: "./htdocs" });

appServer.addRoute(settings.edit, wiki.edit, { settings: settings });
appServer.addRoute(settings.save, wiki.save, { settings: settings });
appServer.addRoute(settings.page, wiki,      { settings: settings });

appServer.addRoute(".+", appServer.plugins.fourohfour);

// log an error event
appServer.addEventHandler('run.fatal', function (error) { console.log("FATAL: " + error); });

var server = appServer.createServer();

server.listen(3000);
console.log("Listening on http://localhost:3000/");