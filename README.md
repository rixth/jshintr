# jshintr

Serves as a simple web interface to JSHint that allows you to set your own rules, and link other developers to JSHint output. It's also designed to allow you to override certain error messages.

It's designed to parse files that only exist on the same system as the app itself, for example, a dev server at your workplace. It should never, ever, EVER be accessible from the outside world, since it has access to the filesystem via a URL parameter.

## Requirements

    npm install express
    npm install jade

## Acknowledgments

* CSS based [Connect middleware](hhttps://github.com/senchalabs/Connect) exception pages
* JS magic by [JSHint](https://github.com/jshint/jshint)
* Vowels dropped specifically to annoy Louis B.