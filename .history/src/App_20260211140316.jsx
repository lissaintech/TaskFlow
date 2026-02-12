import { useState } from 'react'

function App() {

  const [tasks, setTasks] = useState([]);

  const addTask = () => {
    
  };

  return (
    <div>
      <h1>TaskFlow</h1>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter task"
      />

      <button onClick={addTask}>Add</button>
    </div>
  );
}

export default App;
