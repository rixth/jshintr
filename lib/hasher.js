var crypto = require('crypto');

// Creates a unique 8 character hash of an issue
// raised by JSHint. It is agnostic of line number
// and character position. Due to this, multiple
// errors in a file can share the same hash...

module.exports = (function () {
  return function (error, source) {
    var hashString = '',
        errorLineContents = source.split("\n")[error.line - 1],
        startWhitespace = errorLineContents.match(/^\s*/)[0].length;
    
    hashString = (error.character - startWhitespace) + error.reason + errorLineContents.trim();
    return crypto.createHash('sha1').update(hashString).digest('hex').substr(0, 8);
  }
}());