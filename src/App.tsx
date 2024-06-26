import React from 'react';
import './App.css';
import ChartComponent from './ChartComponent';

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>React Chart App</h1>
      </header>
      <main>
        <ChartComponent />
      </main>
    </div>
  );
};

export default App;
