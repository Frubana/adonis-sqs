const Dispatch = async (SQS, url, data) => {
  const params = {
    DelaySeconds: data.delay,
    MessageBody: JSON.stringify(data.data),
    QueueUrl: url
  };

  if (data.group && data.id) {
    params.MessageDeduplicationId = `${data.id}`;
    params.MessageGroupId = `${data.group}`;
  }

  return new Promise((resolve, reject) => {
    SQS.sendMessage(params, (error, result) => {
      if (error) {
        console.log('error queue', error);
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};

module.exports = Dispatch;
