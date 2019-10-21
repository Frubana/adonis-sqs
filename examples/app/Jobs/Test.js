const Logger = use('Logger');

class Test {
  async handler(data, message, done) {
    Logger.info('Queue started Test');

    done(true);
  }
}

module.exports = Test;
