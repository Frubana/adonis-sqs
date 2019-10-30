# SQS Adonis Provider

**This is a WIP**

## Setup

Make sure to register the provider and make all of the following necessary changes inside the `start/app.js` file!

```js
// Add the sqs provider
const providers = [
  // ...
  "@frubana/adonis-sqs/providers/Provider"
];
```

## Config

Please update configuration before use. The configuration file is `config/queues.js`.

## Define your Job

```js
// app/Jobs/Test.js

const Logger = use("Logger");

class Test {
  async handler(data, message, done) {
    Logger.info("Queue started Test");

    done(true);
  }
}

module.exports = Test;
```
