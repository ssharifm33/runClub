import React from 'react';
import './RunItem.css';


function RunItem({ run }) {
  return (
    <div className="card h-100">
      <div className="card-header text-white bg-dark">
        {new Date(run.date).toLocaleDateString()}
      </div>
      <div className="card-body">
        <p className="card-text">
          <strong>Distance:</strong> {run.distance} km<br />
          <strong>Time:</strong> {run.time}
        </p>
      </div>
    </div>
  );
}

export default RunItem;
