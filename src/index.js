const Configuration = require("./Configuration");
const Dispatch = require("./Dispatch");
const Listener = require("./Listener");

class Queue {
  constructor(Config, Logger, helpers, fileConfig = "queues") {
    this.config = Config.get(fileConfig);
    this.logger = Logger;
    this.helpers = helpers;
    this.listeners = {};

    this.SQS = Configuration(Config, Logger);

    const { region } = this.config;

    this.SQS.config.update({ region });
  }

  async dispatch(name, data, { delay = 0, group, id }, queueName = "default") {
    const json = Object.assign(data, { queue: name });

    const url = this.config.url || this.config.queues[queueName];

    try {
      const result = await Dispatch(this.SQS, url, {
        delay,
        group,
        id,
        data: json
      });

      this.logger.info("queue dispatched");

      return result;
    } catch (error) {
      this.logger.info("queue error", error);

      return null;
    }
  }

  listen(queueName = "default") {
    if (this.listeners[queueName]) {
      return;
    }

    const queue = new Listener(this.SQS, this.config, this.helpers, queueName);
    this.listeners[queueName] = queue;
  }

  stop(queueName = "default") {
    if (!this.listeners[queueName]) {
      return;
    }

    const queue = this.listeners[queueName];
    queue.stop();
  }

  resume(queueName = "default") {
    if (!this.listeners[queueName]) {
      return;
    }

    const queue = this.listeners[queueName];
    queue.resume();
  }
}

module.exports = Queue;
