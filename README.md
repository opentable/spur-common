# spur-common

Common node library that is implemented through the use of spur-ioc and bluebird promises.

The project is still a work in progress. We are in the middle of making adjustments and are starting to dogfood the module in our own applications.

[![NPM version](https://badge.fury.io/js/spur-common.png)](http://badge.fury.io/js/spur-common)
[![Build Status](https://travis-ci.org/opentable/spur-common.png?branch=master)](https://travis-ci.org/opentable/spur-common)

## Installing

```bash
$ npm install spur-common --save
```

## What is injected by default?

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

## Usage

### src/injector.js

```javascript
var spur = require("spur-ioc");
var spurCommon = require("spur-common");

module.exports = function(){
  // define a  new injector
  var ioc = spur.create("demo");

  // register node modules to be injected
  ioc.registerLibraries({
    ...
  });

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

### start.js

```javascript
injector = require "./src/injector"

injector().inject (UncaughtHander, Logger)->

  Logger.info "Starting app..."

  // Here you would inject your dependencies like WebServer or runtime class and start it.

  // Enabled the UncaughtHander
  UncaughtHander.listen()
```

