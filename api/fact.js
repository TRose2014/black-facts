'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk')

AWS.config.setPromisesDependency(require('bluebird'));

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.submit = (event, context, callback) => {
  const requestBody = JSON.parse(event.body);
  const fact = requestBody.fact;
  const title = requestBody.title;
  const type = requestBody.type;

  if(typeof fact !== 'string' || typeof title !== 'string' || typeof type !== 'string'){
    console.error('Validation Failed');
    callback(new Error('Could not submit fact because of validation error'));
    return;
  }

  submitFactP(factInfo(fact, title, type))
    .then(res => {
      callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          message: `Sucessfully submitted fact ${title}`,
          factId: res.id
        })
      });
    })
    .catch(err => {
      console.log(err);
      callback(null, {
        statusCode: 500,
        body: JSON.stringify({
          message: `Unable to submit fact ${title}`
        })
      })
    });
};

const submitFactP = fact => {
  console.log('Submitting fact');
  const factInfo = {
    TableName: process.env.FACT_TABLE,
    Item: fact,
  };
  return dynamoDb.put(factInfo).promise()
    .then(res => fact);
};

const factInfo = (fact, title, type) => {
  const timestamp = new Date().getTime();
  return{
    id: uuid.v1(),
    fact: fact,
    title: title,
    type: type,
    submittedAt: timestamp,
    updatedAt: timestamp,
  };
};

module.exports.list = (event, context, callback) => {
  const params = {
    TableName: process.env.FACT_TABLE,
    ProjectionExpression: "id, fact, title"
  };

  console.log("Scanning Fact table");
  const onScan = (err, data) => {
    if(err) {
      console.log("Scan failed to load data. Error JSON:", JSON.stringify(err, null, 2));
      callback(err);
    }else {
      console.log("Scan succeeded");
      return callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          facts: data.Items
        })
      });
    }
  }
  dynamoDb.scan(params, onScan);
};

module.exports.get = (event, context, callback) => {
  const params = {
    TableName: process.env.FACT_TABLE,
    Key: {
      id: event.pathParameters.id,
    },
  };

  dynamoDb.get(params).promise()
    .then(result => {
      const response = {
        statusCode: 200,
        body: JSON.stringify(result.Item),
      };
      callback(null, response);
    })
    .catch(err => {
      console.error(err);
      callback(new Error('Could not fetch fact'));
      return;
    });
};

module.exports.deleteById = (event, context, callback) => {
  const params = {
    TableName: process.env.FACT_TABLE,
    Key: {
      id: event.pathParameters.id,
    },
  };

  dynamoDb.delete(params).promise()
    .then(result => {
      const response = {
        statusCode: 200,
        body: JSON.stringify(`Item ${result.id} has been deleted`),
      };
      callback(null, response);
    })
    .catch(err => {
      console.error(err);
      callback(new Error('Could not fetch fact'));
      return;
    });
};
