const AWS = require('aws-sdk');

const Configuration = (config, logger) => {
  const { key, secret, region } = config;

  AWS.config.update({ region });

  if (key && secret) {
    logger.info('AWS with custom credentials');

    return new AWS.SQS({
      accessKeyId: key,
      secretAccessKey: secret
    });
  }

  logger.info('AWS with default credentials');
  return new AWS.SQS();
};

module.exports = Configuration;
