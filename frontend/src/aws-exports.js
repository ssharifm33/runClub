// src/aws-exports.js
const awsconfig = {
  Auth: {
    region: 'us-east-2', // Replace with your AWS region
    userPoolId: 'us-east-2_rtej0gsJq', // Replace with your User Pool ID
    userPoolWebClientId: '7t2snkjjf1ltiifaab2jn8kif9', // Replace with your App Client ID
    mandatorySignIn: true,
    oauth: {},
  },
};

export default awsconfig;
