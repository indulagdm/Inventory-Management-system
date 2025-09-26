import React from "react";
import './Loading.css'

const Loading = () => {
  return (
    <div className="loading-container">
      <div class="loading-bar">
        <div class="progress"></div>
      </div>
    </div>
  );
};

export default Loading;
