import React from 'react';

function RunItem({ run }) {
  return (
    <li>
      <p>Date: {run.date}</p>
      <p>Distance: {run.distance} km</p>
      <p>Time: {run.time} minutes</p>
    </li>
  );
}

export default RunItem;
