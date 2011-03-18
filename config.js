module.exports = {
  port: 3000,
  modes: {
    options: 'mergeUnder',
    globals: 'mergeUnder'
  },
  jshint: {
    options: {
      browser: true,
      jquery: true,
      indent: 2,
      white: true,
      curly: true,
      forin: true,
      noarg: true,
      immed: true,
      newcap: false,
      noempty: true,
      nomen: true,
      eqeqeq: true,
      undef: true
    },
    globals: {
      // varName: readonly (true or null)
    }
  }
};