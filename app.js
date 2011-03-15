
/**
 * Module dependencies.
 */

var fs = require('fs'),
    crypto = require('crypto'),
    express = require('express'),
    app = module.exports = express.createServer(),
    jshint = require('./lib/jshint.js').JSHINT,
    config = require('./config.js');

// Configuration
app.configure(function () {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

// Goodness
app.get('/', function (req, res){
  var filename = ('/' + req.query.file).replace(/hint$/, '');

  fs.readFile(filename, function (err, data) {
    if (err) {
      res.render('sadface', {
        filename: filename
      });
    } else {
      var source = data.toString('utf8'),
          result = jshint(source, config.jshint.options),
          errors = [],
          sourceLines,
          numLines,
          context = 2;

      if (!result && jshint.errors[0]) {
        sourceLines = source.split("\n");
        numLines = sourceLines.length;
        
        jshint.errors.forEach(function (error) {
          if (!error) {
            return;
          }
          
          var startIndex = error.line - (context + 1) > 0 ? error.line - (context + 1) : 0,
              endIndex = error.line + context > numLines ? numLines : error.line + context,
              errorLineContents;
          
          // Generate a source except
          error.excerpt = {};
          sourceLines.slice(startIndex, endIndex).forEach(function (line, lineOffset) {
            error.excerpt[startIndex  + 1 + lineOffset] = line;
          });
          
          // Insert a span to highlight the error itself
          errorLineContents = injectString(error.excerpt[error.line], '<span>', error.character - 2);
          errorLineContents = injectString(errorLineContents, '</span>', error.character + 6);
          error.excerpt[error.line] = errorLineContents;
          error.hash = crypto.createHash('sha1').update(error.reason+errorLineContents.trim()).digest('hex').substr(0, 8);
          
          errors.push(error);
        });
      }
      
      res.render('index', {
        errors: errors
      });
    }
  });
});

// Only listen on $ node app.js

if (!module.parent) {
  app.listen(config.port);
  console.log("Express server listening on port %d", app.address().port);
}

function injectString(string, inject, where) {
  return string.substr(0, where) + inject + string.substr(where);
}