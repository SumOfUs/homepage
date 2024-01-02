'use strict';

module.exports.handler = async (event, context, callback) => {
  const token = process.env.CI_TOKEN;
  const url = `https://circleci.com/api/v1.1/project/github/SumOfUs/homepage?circle-token=${token}`;

  const data = {
    build_parameters: {
      PRODUCTION_BUILD: true,
    },
  };

  try {
    await global.fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  } catch (err) {
    console.log(err);
  }

  const response = {
    statusCode: 200,
    headers: {},
    body: JSON.stringify({ message: 'received' }),
  };

  callback(null, response);
};
