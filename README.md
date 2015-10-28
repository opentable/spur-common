<img src="https://opentable.github.io/spur/logos/Spur-Common.png?rand=1" width="100%" alt="Spur: Common" />

A [Node.js](http://nodejs.org/) library of common modules used to create common applications.

[![NPM version](https://badge.fury.io/js/spur-common.png)](http://badge.fury.io/js/spur-common)
[![Build Status](https://travis-ci.org/opentable/spur-common.png?branch=master)](https://travis-ci.org/opentable/spur-common)

# About the Spur Framework

The Spur Framework is a collection of commonly used Node.JS libraries used to create common application types with shared libraries.

[Visit NPMJS.org for a full list of Spur Framework libraries](https://www.npmjs.com/browse/keyword/spur-framework) >>

# Topics

- [Quick start](#quick-start)
    - [Usage](#usage)
- [Available dependencies in injector](#available-dependencies-in-injector)
- [Contributing](#contributing)
- [License](#license)

# Quick start

## Installing

```bash
$ npm install spur-ioc --save
$ npm install spur-common --save
```

## Usage

#### `src/injector.js`

```javascript
var spur       = require("spur-ioc");
var spurCommon = require("spur-common");

module.exports = function(){

  // define a  new injector
  var ioc = spur.create("demo");

  // register already constructed objects such as globals
  ioc.registerDependencies({
    ...
  });

  // register folders in your project to be autoinjected
  ioc.registerFolders(__dirname, [
    "demo"
  ]);

  // THIS IS THE IMPORTANT PART: Merge the spur-common dependencies to your local container
  ioc.merge(spurCommon())

  return ioc;
}
```

#### `start.js`

```javascript
var injector = require("./src/injector");

injector().inject(function(UncaughtHander, Logger){

  Logger.info("Starting app...");

  // Here you would inject your dependencies like WebServer or runtime class and start it.

  // Enabled the UncaughtHander
  UncaughtHander.listen();

});
```

# Available dependencies in injector

To see the latest list of the default dependencies that are injected, check out the [injector.coffee](src/injector.coffee) file.

Libraries: (injection alias/library)

```javascript
  {
    "_"               : "lodash"
    "Promise"         : "bluebird"
    "fs"              : "fs"
    "path"            : "path"
    "SpurErrors"      : "spur-errors"
    "winston"         : "winston"
    "moment"          : "moment"
    "superagent"      : "superagent"
  }
```

Others:

```javascript
  {
    "console"         : console
    "nodeProcess"     : process
  }
```

Directory contents from src/:

```javascript
  [
    "core"
    "fixtures"
    "http"
    "logging"
    "promisify"
    "utils"
  ]
```

Note: Any injectors in which you merge this library to will get all of these dependencies by default.

# Contributing

## We accept pull requests

Please send in pull requests and they will be reviewed in a timely manner. Please review this [generic guide to submitting a good pull requests](https://github.com/blog/1943-how-to-write-the-perfect-pull-request). The only things we ask in addition are the following:

 * Please submit small pull requests
 * Provide a good description of the changes
 * Code changes must include tests
 * Be nice to each other in comments. :innocent:

## Style guide

The majority of the settings are controlled using an [EditorConfig](.editorconfig) configuration file. To use it [please download a plugin](http://editorconfig.org/#download) for your editor of choice.

## All tests should pass

To run the test suite, first install the dependancies, then run `npm test`

```bash
$ npm install
$ npm test
```

# License

[MIT](LICENSE)
