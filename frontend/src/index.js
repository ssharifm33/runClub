import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Amplify } from 'aws-amplify';
import awsconfig from './aws-exports'; // Correctly import the awsconfig

Amplify.configure({
  Auth: {
    region: 'us-east-2',
    userPoolId: 'us-east-2_rtej0gsJq',
    userPoolWebClientId: '7t2snkjjf1ltiifaab2jn8kif9',
    mandatorySignIn: true,
    oauth: {},
  },
});


ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
