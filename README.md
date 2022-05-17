<img src="https://opentable.github.io/spur/logos/Spur-Common.png?rand=1" width="100%" alt="Spur: Common" />

A [Node.js](http://nodejs.org/) library of common modules used to create common applications.

  [![NPM Version][npm-version-image]][npm-url]
  [![NPM Install Size][npm-install-size-image]][npm-install-size-url]
  [![NPM Downloads][npm-downloads-image]][npm-downloads-url]

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
const spur       = require('spur-ioc');
const spurCommon = require('spur-common');

module.exports = function(){

  // define a  new injector
  const ioc = spur.create('demo');

  // register already constructed objects such as globals
  ioc.registerDependencies({
  });

  // register folders in your project to be autoinjected
  ioc.registerFolders(__dirname, [
    'demo/'
  ]);

  // THIS IS THE IMPORTANT PART: Merge the spur-common dependencies to your local container
  ioc.merge(spurCommon())

  return ioc;
}
```

#### `start.js`

```javascript
const injector = require('./src/injector');

injector().inject(function (UncaughtHandler, Logger) {

  Logger.info('Starting app...');

  // Here you would inject your dependencies like WebServer or runtime class and start it.

  // Enabled the UncaughtHandler
  UncaughtHandler.listen();

});
```

# Available dependencies in injector

To see the latest list of the default dependencies that are injected, check out the [injector.js](src/injector.js) file. Here is a short list of of all of the dependencies available:

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
| **Promise**       | [bluebird](https://www.npmjs.org/package/bluebird)               |
| **superagent**    | [superagent](https://www.npmjs.org/package/superagent)           |
| **FormData**      | [form-data](https://www.npmjs.org/package/form-data)             |
| **consoleColors** | [colors](https://www.npmjs.org/package/colors)                   |
| **SpurErrors**    | [spur-errors](https://www.npmjs.org/package/spur-errors)         |

### Local dependecies

All of the files under the `src/` directory are made available when this module is merged into another injector. The following list are the notable dependencies available.

| Name                | Source                                  | Description                                                                                                                                                                                                  |
| :----               | :----                                   | :----                                                                                                                                                                                                        |
| **BaseDelegate**    | [code](src/core/BaseDelegate.js)    | A utility class used to create classes with delegates that can be allow us to replace implementations dynamically and allow for plugins. For an example, take a look at [Logger](src/logging/Logger.js). |
| **UncaughtHandler** | [code](src/core/UncaughtHandler.js) | Simple module that catches uncaught errors when initialized.                                                                                                                                                 |
| **FixtureUtil**     | [code](src/fixtures/FixtureUtil.js) | Fixtures util that allows you to read test files from a specific directory.                                                                                                                                  |
| **HTTPService**     | [code](src/http/HTTPService.js)     | An extension of the superagent module to support promises and other nice enhancements to make HTTP requests simpler to process.                                                                              |
| **Logger**          | [code](src/logging/Logger.js)       | An implementation of a logger that extends console.log and makes it so you can add plugins for logging to different sources.                                                                                 |
| **fsPromise**       | [code](src/promisify/fsPromise.js)  | A wrapper for the Node fs module that adds promises to the module.                                                                                                                                           |
| **Utils**           | [code](src/utils/Utils.js)          | A collection of random utilities.                                                                                                                                                                            |


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

[npm-downloads-image]: https://badgen.net/npm/dm/spur-common
[npm-downloads-url]: https://npmcharts.com/compare/spur-common?minimal=true
[npm-install-size-image]: https://badgen.net/packagephobia/install/spur-common
[npm-install-size-url]: https://packagephobia.com/result?p=spur-common
[npm-url]: https://npmjs.org/package/spur-common
[npm-version-image]: https://badgen.net/npm/v/spur-common
