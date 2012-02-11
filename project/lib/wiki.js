(function () {
  var mongo      = require('mongoskin'),
      marked     = require('marked'),
      handlebars = require('handlebars');
  
  var fs = require('fs');
  
  var edit = fs.readFileSync(__dirname + '/templates/edit.tpl', "utf8");
  var page = fs.readFileSync(__dirname + '/templates/page.tpl', "utf8");
  
  var mongodb;
  
  exports.init = function (options) {
    mongodb = mongo.db(options.settings.database);
  };
  
  // page
  exports.plugin = function (request, response, options) {
    var collection = mongodb.collection(options.settings.collection);
    
    var document = request.url.match(options.path);

    collection.findOne(
      { page: document[1] },
      { body: { "$slice": -1 } }, 
      function (err, data) {
        // this should not occur, but it might
        if (err) {
          console.warn(err);

          response.next();
        } else {
          // if there is no document matching, redirect to the edit page
          if (data === null) {
            response.statusCode(307);
            response.setHeader('Location','/wiki/' + document[1] + '/edit');

            // nothing else should happen, end all writeable routes
            response.final();
          } else {
            var template = handlebars.compile(page);

            data.body = marked(data.body[0]);

            response.write(template(data));
            response.end();
          }
        }
    });
  };

  // edit
  exports.edit = function (request, response, options) {
    var collection = mongodb.collection(options.settings.collection);
    
    var document = request.url.match(options.path);

    collection.findOne(
      { page: document[1] },
      { body: { "$slice": -1 } },
      function (err, data) {
      // bad error, no donut
      if (err) {
        console.warn(err);
        response.next();
      } else {
        var template = handlebars.compile(edit);

        data = data || { page: document[1] };

        response.write(template(data));
        response.end();
      }
    });
  };
  
  exports.save = function (request, response, options) {
    var collection = mongodb.collection(options.settings.collection);
    
    var document = request.url.match(options.path);

    var title = request.param('title');
    var body = request.param('body');
    
    collection.update(
      { page: document[1], title: title },
      { "$push": { body: body } },
      { safe: true, upsert: true },
      function (err, data) {
        // oh no, we shouldn't be getting this
        if (err) {
          console.warn(err);
          response.next();
        } else {
          response.setHeader('Location', '/wiki/' + document[1]);
          response.statusCode(307);

          // nothing else should happen, end all writeable routes
          response.final();
        }
      }
    );
  };
})();