var jshint = require('./jshint.js').JSHINT;

module.exports = (function () {
  var jshintHeaderRegex = /\/\*jshint (.+?)\*\//m,
      booleanOptions = 'adsafe asi bitwise boss browser cap couch css curly debug devel eqeqeq es5 evil forin fragment immed jquery laxbreak loopfunc newcap noarg node noempty nonew nomen on onevar passfail plusplus regexp rhino undef safe windows strict sub white widget'.split(' ');
  
  function hinter(source, config) {
    this.source = source;
    this.originals = {
      jshintHeader: this.source.match(jshintHeaderRegex)
    };
    
    return [
      jshint(source),
      jshint.errors
    ];
  }
    
  return hinter;
}());