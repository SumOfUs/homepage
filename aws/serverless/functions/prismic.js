'use strict';

const http = require('request');

module.exports.handler = (event, context, callback) => {
  const body = JSON.parse(event.body);
  console.log(JSON.stringify(body));
  const token = process.env.CI_TOKEN;
  const url = `https://circleci.com/api/v1.1/project/github/SumOfUs/homepage/tree/prismic?circle-token=${token}`;


  http
  .post(url, (err, response, body) => {
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
