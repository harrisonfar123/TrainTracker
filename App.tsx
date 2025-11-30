
import React from 'react';
import TrainTracker from './features/trainTracker/TrainTracker';
import './App.css';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>US Passenger Train Tracker</h1>
        <p>Track trains across major passenger rail networks in the United States. Built using open-source data from <a href="https://github.com/mgwalker/amtrak-api" target="_blank" rel="noopener noreferrer">[github.com](https://github.com/mgwalker/amtrak-api)</a> and real-time visualization with <a href="https://liverailmap.com/" target="_blank" rel="noopener noreferrer">[liverailmap.com](https://liverailmap.com/)</a>. Inspired by <a href="https://github.com/cis3296f24/TrainTracker" target="_blank" rel="noopener noreferrer">[github.com](https://github.com/cis3296f24/TrainTracker)</a>.</p>
      </header>
      <TrainTracker />
    </div>
  );
}

export default App;
