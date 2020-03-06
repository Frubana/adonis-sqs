const Configuration = require('./Configuration');
const Dispatch = require('./Dispatch');
const Listener = require('./Listener');

class Queue {
  constructor(Config, Logger, helpers, fileConfig = 'queues') {
    this.config = Config.get(fileConfig);
    this.logger = Logger;
    this.helpers = helpers;

    this.SQS = Configuration(Config, Logger);

    const { region } = this.config;

    this.SQS.config.update({ region });
  }

  async dispatch(name, data, { delay = 0, group, id }) {
    const json = Object.assign(data, { queue: name });

    try {
      const result = await Dispatch(this.SQS, this.config.url, {
        delay,
        group,
        id,
        data: json
      });

      this.logger.info('queue dispatched');

      return result;
    } catch (error) {
      this.logger.info('queue error', error);

      return null;
    }
  }

  listen() {
    this.listener = new Listener(this.SQS, this.config, this.helpers);
  }
}

module.exports = Queue;
