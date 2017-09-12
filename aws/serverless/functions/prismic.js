'use strict';

module.exports.handler = (event, context, callback) => {
  console.log(JSON.stringify(event));

  const response = {
    statusCode: 200,
    headers: {},
    body: JSON.stringify({ "message": "received" })
  };

  callback(null, response);
};
