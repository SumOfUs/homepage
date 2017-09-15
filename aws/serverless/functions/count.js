'use strict';
const mysql = require('mysql');
const {USER, HOST, PASSWORD} = process.env;
const AWS = require('aws-sdk');
const s3 = new AWS.S3();

const fetch = () => {
  let connection = mysql.createConnection({
    host     : HOST,
    user     : USER,
    password: PASSWORD,
    database : 'ak_sumofus'
  });

  connection.connect();

  connection.query('SELECT MAX(id) AS count FROM core_user', (error, results, fields) => {
    console.log('foo');
    if(error) console.log(error);
    if (error) throw error;
    let count = results[0].count;

    let params = {
      Body: JSON.stringify({count: count}),
      Bucket: "sou-homepage-counter",
      ACL: 'public-read',
      ContentType: 'application/json',
      Key: "count.json",
    };

    s3.putObject(params, (err, data) => {
      if(err) console.log("ERROR writing to bucket", err);
    });
  });
  
  connection.end();
};

module.exports.handler = (event, context, callback) => {
  fetch();
  callback();
};
