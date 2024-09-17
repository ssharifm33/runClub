import React from 'react';

function RunItem({ run }) {
  return (
    <li>
      <p>Date: {formatDate(run.date)}</p>
      <p>Distance: {run.distance} km</p>
      <p>Time: {run.time} minutes</p>
    </li>
  );
}

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}


export default RunItem;
