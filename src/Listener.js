/* eslint-disable global-require */

class Listener {
  constructor(sqs, config, helpers, queueName = "default") {
    this.sqs = sqs;
    this.helpers = helpers;
    this.config = config;
    this.listening = true;
    this.url = this.config.url || this.config.queues[queueName];

    sqs.config.update({ region: config.region });

    this.listen.bind(this);

    this.listen();
  }

  stop() {
    this.listening = false;
  }

  resume() {
    this.listening = true;
    this.listen();
  }

  async delete(handler) {
    const params = {
      QueueUrl: this.url,
      ReceiptHandle: handler
    };

    this.sqs.deleteMessage(params, error => {
      if (error) {
        console.log("error deleting", error);
        return false;
      }

      return true;
    });
  }

  async listen() {
    const params = {
      AttributeNames: ["All"],
      MessageAttributeNames: ["All"],
      VisibilityTimeout: this.config.visibility || 30,
      MaxNumberOfMessages: this.config.concurrency || 1,
      QueueUrl: this.url,
      WaitTimeSeconds: this.config.timeout || 20
    };

    this.sqs.receiveMessage(params, (err, data) => {
      if (err) {
        setTimeout(() => this.listen(), 1000 * 5);
        return;
      }

      if (!data.Messages) {
        this.listen();
        return;
      }

      data.Messages.forEach(async message => {
        let json = JSON.parse(message.Body);

        if (typeof json === "string") {
          json = JSON.parse(json);
        }

        const handle = message.ReceiptHandle;

        if (!json.queue) {
          this.delete(handle);
        }

        const caller = this.controller(json.queue);

        caller(json, message, ready => {
          if (!ready) {
            throw new Error("Your queue is maked not completed");
          }

          this.delete(handle);

          if (!this.listening) {
            return;
          }

          this.listen();
        }).catch(error => {
          setTimeout(() => {
            if (!this.listening) {
              return;
            }

            this.listen();
          }, this.config.visibility);
        });
      });
    });
  }

  controller(name) {
    const root = this.helpers.appRoot();
    const route = `${root}/app/Jobs/${this.capitalize(name)}.js`;

    // eslint-disable-next-line global-require
    // eslint-disable-next-line import/no-dynamic-require
    const Module = require(route);
    const module = new Module();

    if (typeof module.handler === "function") {
      return module.handler.bind(module);
    }

    throw new Error(`We can't find ${route} handler function`);
  }

  capitalize(s) {
    if (typeof s !== "string") return "";
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
}

module.exports = Listener;
