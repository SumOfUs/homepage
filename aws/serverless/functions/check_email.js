'use strict';

const axios = require('axios');
const CONSENT_ENDPOINT = process.env.CONSENT_ENDPOINT;

const removeConsentFromChampaign = email => (
  axios.delete(`${CONSENT_ENDPOINT}?email=${encodeURIComponent(email)}`)
)

const memberExists = email => {
  return new Promise( (resolve, reject) => {
    axios.get(`https://act.sumofus.org/rest/v1/user/?email=${encodeURIComponent(email)}`, {
      auth: {
        username: process.env.AK_USERNAME,
        password: process.env.AK_PASSWORD
      }
    })
    .then( resp => {

      resolve(
        resp.data.objects.length > 0 &&
        resp.data.objects[0].email === email &&
        resp.data.objects[0].subscription_status === 'subscribed'
      )
    })
    .catch( err => reject(err) )
  });
}

module.exports.handler = async (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: '',
    headers: {
      "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
      "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS
    },
  };

  const email = event.queryStringParameters.email;

  if(!email) {
    response.statusCode = 404;
    return callback(null, repsonse);
  }

  try {
    await removeConsentFromChampaign(email);
    response.statusCode = (await memberExists(email)) ? 200 : 404;
    response.body = JSON.stringify({ email: email });
  } catch(e) {
    response.statusCode = 500;
  }

  return callback(null, response);
};
