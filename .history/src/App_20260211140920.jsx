import { useState } from 'react'

function App() {

  const [input, setInput] = useState("");

  const [tasks, setTasks] = useState([]);

  const addTask = () => {
    if(input.trim()=="") return;

    setTasks([...tasks, input])
    setInput("");
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

      <ul>
        {tasks.map()}
      </ul>
    </div>
  );
}

export default App;
