const { ServiceProvider } = require("@adonisjs/fold");

const Queue = require("../src");

class QueueProvider extends ServiceProvider {
  /**
   * Register namespaces to the IoC container
   *
   * @method register
   *
   * @return {void}
   */
  register() {
    const Config = this.app.use("Adonis/Src/Config");
    const Helpers = this.app.use("Adonis/Src/Helpers");
    const Logger = this.app.use("Adonis/Src/Logger");

    this.app.singleton("SQS", () => {
      return new Queue(Config, Logger, Helpers);
    });
  }

  /**
   * Attach context getter when all providers have
   * been registered
   *
   * @method boot
   *
   * @return {void}
   */
  boot() {
    const Helpers = this.app.use("Adonis/Src/Helpers");

    if (Helpers.isAceCommand()) {
      return;
    }

    const Provider = use("SQS");
    Provider.listen();
  }
}

module.exports = QueueProvider;
