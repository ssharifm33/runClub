const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const { v4: uuidv4 } = require('uuid');

exports.handler = async (event) => {
  const data = JSON.parse(event.body);

  const params = {
    TableName: 'Runs',
    Item: {
      id: uuidv4(),
      ...data,
    },
  };

  try {
    await dynamoDb.put(params).promise();

    return {
      statusCode: 201,
      body: JSON.stringify({ status: 'success', run: params.Item }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  } catch (error) {
    console.error(error);

    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error saving run' }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }
};
