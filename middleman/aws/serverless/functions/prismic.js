'use strict';

const http = require('needle');

module.exports.handler = (event, context, callback) => {
  const token = process.env.CI_TOKEN;
  const url = `https://circleci.com/api/v1.1/project/github/SumOfUs/homepage?circle-token=${token}`;

  const data = {
    build_parameters: {
      PRODUCTION_BUILD: true
    }
  };

  http
  .post(url, data).on('done', (err, response, body) => {
    if(err){
      console.log('error:', err);
    }

    console.log(body);
  });

  const response = {
    statusCode: 200,
    headers: {},
    body: JSON.stringify({ "message": "received" })
  };

  callback(null, response);
};
