'use strict';

const axios = require('axios');
const CONSENT_ENDPOINT = process.env.CONSENT_ENDPOINT;

const removeConsentFromChampaign = email => (
  axios.delete(CONSENT_ENDPOINT, { data: { email: email.toLowerCase() } })
  .then( resp => console.log(resp) );
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
        resp.data.objects[0].email.toLowerCase() === email.toLowerCase()
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
    response.statusCode = (await memberExists(email)) ? 200 : 404;
    response.body = JSON.stringify({ email: email });
  } catch(e) {
    response.statusCode = 500;
  }

  try {
    await removeConsentFromChampaign(email);
  } catch(e) {
    // console.log("Unable to update champaign:", e);
  }

  return callback(null, response);
};
