#Topics

- [API](#api)
  - [Core](#core)
    - [BaseDelegate](#basedelegate)
    - [Timer](#timer)
    - [UncaughtHandler](#uncaughthandler)
  - [Fixtures](#fixtures)
    - [FixtureUtil](#fixtureutil)
  - [HTTP](#http)
    - [HTTPService](#httpservice)
    - [HTTPPlugin](#httpplugin)
    - [HTTPTiming](#httptiming)
    - [HTTPLogging](#httplogging)
  - [Logging](#logging)
    - [Logger](#logger)

# API

## Core

### BaseDelegate

This class can only be used as a base class in order to extend a simple logger.

```javascript
module.exports = function (BaseDelegate) {

  class ConsoleLogger extends BaseDelegate {

    constructor() {
      this.supportsMethods([
        "fatal"
        "error"
        "warn"
        "info"
        "log"
        "debug"
        "verbose"
      ]);
    }

  }
  
  return new ConsoleLogger();
}
```

#### `Properties`

| Name           | Type   | Description                                                                                                          |
| :----          | ----   | :----                                                                                                                |
| **.delegates** | array  | List of delegates associated to the class.                                                                           |
| **.recorded**  | object | Object of recorded calls to the delegate when the recorder delegate is used. A propert per method called is created. |

#### `Methods`

| Name                                                          | Description                                                                                                                                  |
| :----                                                         | :----                                                                                                                                        |
| **.supportsMethods(array)** | Creates a list of methods the delegates will be called upon to support.                                                                      |
| **.use(delegateFn)**                                           | Use to define your own delegate. It must support the list of all supported methods.                                                          |
| **.useNoop()**                                                 | Adds a delegate that doesn't do anything when a method it's supposed to support is called. Mainly used for testing.                          |
| **.useConsole()**                                              | Uses the console.log to support the delegate.                                                                                                |
| **.useRecorder()**                                             | Sets the use of a recorder for the supported method. Mainly used for testing to verify calls to the method were executed with specific data. |

---

### Timer

A helper class to measure the duration between the call of `.start()` and `.stop()`.

```javascript
module.exports = function (Timer, Logger) {

  const timer = new Timer();
  timer.start();

  // Do something to measure

  timer.stop();

  Logger.log(timer.duration);

}
```

#### `Properties`

| Name          | Type   | Description                                                         |
| :----         | ----   | :----                                                               |
| **.duration** | number | Duration between the `.start()` and `.end()` calls in milliseconds. |

#### `Methods`

| Name         | Description      |
| :----        | :----            |
| **.start()** | Starts the timer |
| **.stop()**  | Stops the timer  |

#### `Statics`
| Name                                      | Description                                                                                     |
| :----                                     | :----                                                                                           |
| **Timer.mockDuration(mockDurationMs)** | Changes the timer `.stop()` prototype to always return a specific duration. Mainly for testing. |

---

### UncaughtHandler

Simple module that catches uncaught errors when initialized. This should be initialized at the start of any Node application.

```javascript
const injector = require('./src/injector');

injector().inject(function (UncaughtHandler) {

  UncaughtHandler.listen();

  // Set up the rest of the application

});
```

## Fixtures

### FixtureUtil

#### `sample folder structure/contents`

```
+-- fixtures
|   +-- restaurant-123.js
|   +-- restaurant-124.js
|   +-- restaurant-125.js
|   +-- restaurant-126.js
```

#### `start.js`

```javascript
module.exports = function (FixtureUtil, path) {

  const fixturesPath = path.resolve(__dirname, './fixtures/');
  FixtureUtil.setFixturesPath(fixturesPath);

}
```

#### `loader.js`

```javascript
module.exports = function (FixtureUtil, Logger, JSON) {

  const restaurantsData = [];
  restaurantsData.push(FixtureUtil.get("restaurant-123"));
  restaurantsData.push(FixtureUtil.get("restaurant-124"));
  restaurantsData.push(FixtureUtil.get("restaurant-125"));
  restaurantsData.push(FixtureUtil.get("restaurant-126"));

  Logger.log(JSON.stringify(restaurantsData, null, 2));

  // Would echo the objects that were stored in the .json files

}
```

## HTTP

### HTTPService

HTTPService is based of the popular HTTP request module named [superagent](http://visionmedia.github.io/superagent/). This documentation only covers the custom functionality that we've added in order to add the following features:

 * Support of promises
 * Addition of plugin support
 * Support of logging of every requests
 * Auto parsing of JSON responses

For the full superagent documentation, please visit their [documentation page](http://visionmedia.github.io/superagent/).

#### API

##### `Methods`

| Name  | Description |
| :---- | :----       |
| **HTTPService**.get/post/put/options/head/del | Any of these methods are used to initialize the creation of a request object. No request is triggered as soon as these menthods are called. An http request is only triggered when `.end()`, or one of its wrapper methods is called. |
| **Request**.named(name) | Tags the request with a name for logging |
| **Request**.tagged(tagsObject) | Tags the request with a collection of data for logging |
| **Request**.promise() | Executes the `.end()` call and wraps the error and response handling with a promise. |
| **Request**.promiseBody() | Wraps the `.promise()` call and extracts the `.body` property. |
| **Request**.promiseText() | Wraps the `.promise()` call and extracts the `.text` property. |

##### `Statics`

| Name                                    | Type   | Description                                        |
| :----                                   | :----  | :----                                              |
| **HTTPService**.globalPlugins           | array  | A list of all the plugins registered               |
| **HTTPService**.setGlobalPlugins(plugins) | method | Adds either a sinble plugin or an array of plugins |

#### Examples

##### `Full respose`

```javascript
module.exports = function (HTTPService, HTTPLogging, Logger, JSON) {

  HTTPService
    .get('http://testserver.com/reservations/123')
    .named('ReservationsService')
    .tagged({endpoint: 'Get'})
    .plugin(HTTPLogging)
    .promise().then((res)=> {
      Logger.log('Status Code:', res.statusCode);
      Logger.log(JSON.stringify(res, null, 2));
    });

}
```

##### `Unwrap JSON payload`

```javascript
module.exports = function (HTTPService, HTTPLogging, Logger, JSON) {

  HTTPService
    .get('http://testserver.com/reservations/123')
    .named('ReservationsService')
    .tagged({endpoint: 'Get'})
    .plugin(HTTPLogging)
    .promiseBody().then((payload) => {
      Logger.log(JSON.stringify(payload, null, 2));
    });

}
```

##### `Unwrap text payload`

```javascript
module.exports = function (HTTPService, HTTPLogging, Logger) {

  HTTPService
    .get('http://testserver.com/reservations/123')
    .named('ReservationsService')
    .tagged({endpoint: 'Get'})
    .plugin(HTTPLogging)
    .promiseText().then((text) => {
      Logger.log('Text:', text);
    });

}
```

---

### HTTPPlugin

A base class used to specify the interface of an HTTP plugin. The interface is simply two calls: 1) start of the request, 2) end of the request. This allows for one or many plugins to execute at those two points in the request process.

##### Example implementation

```javascript
module.exports = function (Timer, HTTPPlugin) {

  class HTTPTiming extends HTTPPlugin {

    constructor() {
      this.timer = new Timer();
    }

    start() {
      this.timer.start();
    }

    end() {
      // Add the duration to the request to be used later
      this.request.duration = this.timer.stop();
    }

  }

  return HTTPTiming;
}
```

### HTTPTiming

When set as a global plugin, it will add a duration of the request to all of the http requests made with the HTTPService.

##### Global start script

`Register:`
```javascript
module.exports = function (HTTPService, HTTPTiming) {
  // Register a single global plugin
  HTTPService.setGlobalPlugins(HTTPTiming);

  // Registers an array of global plugins
  HTTPService.setGlobalPlugins([HTTPTiming]);
}
```

`Use from request:`
```javascript
module.exports = function (HTTPService, HTTPLogging, Logger) {

  HTTPService
    .get('http://testserver.com/reservations/123')
    .plugin(HTTPLogging)
    .promise().then((response) => {
      const request = response.request;
      Logger.log('Duration:', request.duration);
    });

}
```

### HTTPLogging

When set as a global plugin, it will log all of the http requests made with the HTTPService.

##### Global start script

```javascript
module.exports = function (HTTPService, HTTPLogging) {

  // Register a single global plugin
  HTTPService.setGlobalPlugins(HTTPLogging);

  // Registers an array of global plugins
  HTTPService.setGlobalPlugins([HTTPLogging]);

}
```

## Logging

### Logger

A simple logging delegate the defaults to the use of the `console.log`. Through the use of delegates you can add additional functionality. At OpenTable we've created delegates to log to Logstash, but only in production environments and only for some of the supported methods.

##### Global set of delegate
```javascript
module.exports = function (Logger) {

  class CustomLogger {

    log(...args) {
      // do something
    }

    info(...args) {
      // do something
    }

    error(...args) {
      // do something
    }

  }

  const instance = new CustomLogger();
  Logger.use(instance);

}
```

##### Usage of the custom logger
```javascript
module.exports = function (Logger) {

  Logger.log('Hi, I am log');
  Logger.info('Hi, I am info');
  Logger.error('Hi, I am error', error);

}
```
