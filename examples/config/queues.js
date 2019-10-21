/** @type {import('@adonisjs/framework/src/Env')} */
const Env = use('Env');

module.exports = {
  /*
  |--------------------------------------------------------------------------
  | Concurrency
  |--------------------------------------------------------------------------
  |
  | Number of queue items to process concurrently
  |
  */
  accessKeyId: Env.get('AWS_ACCESS_KEY'),

  /*
  |--------------------------------------------------------------------------
  | Concurrency
  |--------------------------------------------------------------------------
  |
  | Number of queue items to process concurrently
  |
  */
  secretAccessKey: Env.get('AWS_SECRET_KEY'),

  /*
  |--------------------------------------------------------------------------
  | Region
  |--------------------------------------------------------------------------
  |
  | Where is availavle the queue
  |
  */
  region: Env.getOrFail('AWS_REGION'),

  /*
  |--------------------------------------------------------------------------
  | Url
  |--------------------------------------------------------------------------
  |
  | Url of the queue
  |
  */
  url: Env.getOrFail('QUEUE_MESSAGES'),

  /*
  |--------------------------------------------------------------------------
  | Timeout
  |--------------------------------------------------------------------------
  |
  | Long polling time to refresh the connection, max value is 20 seconds
  |
  */
  timeout: 20,

  /*
  |--------------------------------------------------------------------------
  | Visibility
  |--------------------------------------------------------------------------
  |
  | Is a window time to try to retry message
  |
  */
  visibility: 30
};

