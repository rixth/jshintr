# jshintr

JSHintr is a web tool that allows you to set your own code standards, easily review a file against these standards, and share the output with other developers. It leverages the power of JSHint:

> [JSHint](http://jshint.com) is a community-driven tool to detect errors and potential problems in JavaScript code and to enforce your team's coding conventions. It is very flexible so you can easily adjust it to your particular coding guidelines and the environment you expect your code to execute in.

One barrier to people running jshint is that it's a pain to constantly be copy/pasting code to a textbox to run checks, or to be dropping to a command line. This app aims to help lower this wall, see the section title "Apache handler" below.

If you disagree with a certain issue jshint has raised, you can mark it as skipped. Every issue raised is provided with a code sample with context that expands on hover, even marking the specific characters that were problematic.

It's designed to parse files that only exist on the same system as the app itself, for example, a dev server at your workplace. It should never, ever, EVER be accessible from the outside world, since it has access to the filesystem via a URL parameter.

If you change the options in config.js, you will need to restart the node server.

## Skipping tests

If you disagree with a test result and want to minimize it, click "skip" to the right of the issue type. Note that the URL will update automatically. If you come back to this URL, and the skipped test is not found, its hash will be removed from the URL for you.

The hashes are based on a sha1 off the trimmed code that caused the error, and the error itself. Therefore, the line number on which the error occurs does not matter, nor does whitespace before/after the offending code. A change in variable names or the like, however, will trigger a new issue that'll need to be skipped again.

## Apache handler

The original idea for this script was to enable developers to change the extension on a .js file to .jshint and have it be run through a code check. My dev server runs Apache, so below is a mod\_rewrite rule to proxy *.jshint requests through to jshintr. This requires that you have mod_proxy enabled, and that jshintr is running on port 3000.

Note that the path received by the application will be .jshint, so it does a regex replace of /hint$/ to ''.

    RewriteEngine on
    # Allow the assets to pass through
    RewriteRule /jshintr-assets/(js/application.js|css/style.css)$ http://localhost:3000/$0 [P,L]
    # Do the magic
    RewriteRule ^(.+?)\.jshint http://localhost:3000/?file=%{REQUEST_FILENAME} [P]

## Config

### Modes

The modes setting determines what jshintr does when it it passed a file that already has a jshint headers in it. There are subkeys of "options" and "globals" to determine what you're setting the mode for. Possible values are:

* *mergeUnder (default)*: uses the config.js rules, with ones in the file 
  overriding them.
* *mergeOver*: uses the config.js rules, with the file header "filling in the 
  gaps"
* *leave*: ignores all settings in config.js and just uses the file rules
* *clobber*: strips out the file's header, and uses the rules defined 
  in config.js.

## Requirements

### Browser requirements

Anything modern will do, uses css3 animations and html5 history management, so no IE allowed.

### Server requirements

* node.js
* express
* jade

## Acknowledgments

* CSS based [Connect middleware](hhttps://github.com/senchalabs/Connect) exception pages
* JS magic by [JSHint](https://github.com/jshint/jshint)
* Vowels dropped specifically to annoy Louis B.