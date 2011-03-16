var jshint = require('./jshint.js').JSHINT;

module.exports = (function () {  
  var jshintHeaderRegex = /\/\*jshint (.+?)\*\//m,
      booleanOptions = 'adsafe asi bitwise boss browser cap couch css curly debug devel eqeqeq es5 evil forin fragment immed jquery laxbreak loopfunc newcap noarg node noempty nonew nomen on onevar passfail plusplus regexp rhino undef safe windows strict sub white widget'.split(' ');
  
  function extend(t, o) {
    var n;
    for (n in o) {
      if (o.hasOwnProperty(n)) {
        t[n] = o[n];
      }
    }
    return t;
  }
      
  function getJshintHeader (source) {
    var header = source.match(jshintHeaderRegex),
        options = {};
        
    if (!header) {
      return false;
    }
  
    header[1].trim().split(',').forEach(function (chunk) {
      var bits = chunk.split(':').map(function (bit) {
        return bit.trim();
      });
  
      if (booleanOptions.indexOf(bits[0]) !== -1) {
        // Boolean options must be cast to such
        options[bits[0]] = typeof(bits[1]) !== 'undefined' ? (bits[1] === 'true' ? true : false) : true;
      } else {
        options[bits[0]] = typeof(bits[1]) !== 'undefined' ? bits[1] : true;
      }
    });
  
    return options;
  };
  
  function stripJshintHeader(source, specificOptions) {
    if (Array.isArray(specificOptions)) {
      var header = source.match(jshintHeaderRegex)[0];

      specificOptions.forEach(function (option) {
        header = header.replace(new RegExp(option + '\\s*(|:.*?)(,\\s*|\\*\\/)'), '');
      });

      if (!header.match(/\*\/$/)) {
        header += '*/';
      }

      return source.replace(jshintHeaderRegex, header.replace(/,\s*\*\//, ' */'));
    } else {
      return source.replace(jshintHeaderRegex, '');
    }
  }
  
  return function (source, config) {
    var fileHeaderOptions = getJshintHeader(source),
        optionsToUse = extend({}, config.jshint.options);
    
    if (fileHeaderOptions) {
      switch (config.mode) {
      case 'mergeOver':
        // This requires us to strip out certain rules from their header.
        // so ours take precedence
        source = stripJshintHeader(source, Object.keys(config.jshint.options));
        break;
      case 'leave':
        // Don't apply any options from our config
        optionsToUse = {};
        break;
      case 'clobber':
        // Only apply our options, strip theirs out
        source = stripJshintHeader(source);
        break;
      case 'mergeUnder':
      default:
        // Default behaviour for jshintr & jshint, use our rules
        // as a base, but let theirs override.
      }
    }
    
    return {
      passed: jshint(source, optionsToUse),
      errors: jshint.errors,
      source: source
    };
  }
}());