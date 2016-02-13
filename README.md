<img src="https://opentable.github.io/spur/logos/Spur-Common.png?rand=1" width="100%" alt="Spur: Common" />

A [Node.js](http://nodejs.org/) library of common modules used to create common applications.

[![NPM version](https://badge.fury.io/js/spur-common.png)](http://badge.fury.io/js/spur-common)
[![Build Status](https://travis-ci.org/opentable/spur-common.png?branch=master)](https://travis-ci.org/opentable/spur-common) [![Dependencies](https://david-dm.org/opentable/spur-common.svg)](https://david-dm.org/opentable/spur-common) [![Coverage Status](https://coveralls.io/repos/github/opentable/spur-common/badge.svg?branch=master)](https://coveralls.io/github/opentable/spur-common?branch=master)

# About the Spur Framework

The Spur Framework is a collection of commonly used Node.JS libraries used to create common application types with shared libraries.

[Visit NPMJS.org for a full list of Spur Framework libraries](https://www.npmjs.com/browse/keyword/spur-framework) >>

# Topics

- [Quick start](#quick-start)
    - [Usage](#usage)
- [API Reference](API.md)
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

To see the latest list of the default dependencies that are injected, check out the [injector.coffee](src/injector.coffee) file. Here is a short list of of all of the dependencies available:

### System dependencies

| Name            | Original Module Name | Description             |
| :----           | :----                | :----                   |
| **fs**          | fs                   | Node file system        |
| **path**        | path                 | Node path module        |
| **nodeProcess** | process              | Node process module     |
| **console**     | console              | JavaScript Console      |
| **JSON**        | JSON                 | JavaScript JSON library |

### Libraries

List of external dependencies used and exposed by spur-common. They can be found at npmjs.org using their original names.

| Name              | Original Module Name                                             |
| :----             | :----                                                            |
| **-**             | [lodash](https://www.npmjs.org/package/lodash)                   |
| **Promise**       | [bluebird](https://www.npmjs.org/package/bluebird)               |
| **winston**       | [winston](https://www.npmjs.org/package/winston)                 |
| **moment**        | [moment-timezone](https://www.npmjs.org/package/moment-timezone) |
| **superagent**    | [superagent](https://www.npmjs.org/package/superagent)           |
| **FormData**      | [form-data](https://www.npmjs.org/package/form-data)             |
| **consoleColors** | [colors](https://www.npmjs.org/package/colors)                   |
| **SpurErrors**    | [spur-errors](https://www.npmjs.org/package/spur-errors)         |

### Local dependecies

All of the files under the `src/` directory are made available when this module is merged into another injector. The following list are the notable dependencies available.

| Name                | Source                                  | Description                                                                                                                                                                                                  |
| :----               | :----                                   | :----                                                                                                                                                                                                        |
| **BaseDelegate**    | [code](src/core/BaseDelegate.coffee)    | A utility class used to create classes with delegates that can be allow us to replace implementations dynamically and allow for plugins. For an example, take a look at [Logger](src/logging/Logger.coffee). |
| **UncaughtHandler** | [code](src/core/UncaughtHandler.coffee) | Simple module that catches uncaught errors when initialized.                                                                                                                                                 |
| **FixtureUtil**     | [code](src/fixtures/FixtureUtil.coffee) | Fixtures util that allows you to read test files from a specific directory.                                                                                                                                  |
| **HTTPService**     | [code](src/http/HTTPService.coffee)     | An extension of the superagent module to support promises and other nice enhancements to make HTTP requests simpler to process.                                                                              |
| **Logger**          | [code](src/logging/Logger.coffee)       | An implementation of a logger that extends console.log and makes it so you can add plugins for logging to different sources.                                                                                 |
| **fsPromise**       | [code](src/promisify/fsPromise.coffee)  | A wrapper for the Node fs module that adds promises to the module.                                                                                                                                           |
| **DateTimeUtils**   | [code](src/utils/DateTimeUtils.coffee)  | Wrapper of moment that allows ease of mocking for testing.                                                                                                                                                   |
| **Utils**           | [code](src/utils/Utils.coffee)          | A collection of random utilities.                                                                                                                                                                            |


# Contributing

## We accept pull requests

Please send in pull requests and they will be reviewed in a timely manner. Please review this [generic guide to submitting a good pull requests](https://github.com/blog/1943-how-to-write-the-perfect-pull-request). The only things we ask in addition are the following:

 * Please submit small pull requests
 * Provide a good description of the changes
 * Code changes must include tests
 * Be nice to each other in comments. :innocent:

## Style guide

The majority of the settings are controlled using an [EditorConfig](.editorconfig) configuration file. To use it [please download a plugin](http://editorconfig.org/#download) the plugin for your editor of choice.

## All tests should pass

To run the test suite, first install the dependancies, then run `npm test`

```bash
$ npm install
$ npm test
```

# License

[MIT](LICENSE)
