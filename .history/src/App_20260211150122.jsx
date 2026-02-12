import { useEffect, useState } from 'react'

function App() {

  const [input, setInput] = useState("");

  const [tasks, setTasks] = useState([]);

  const addTask = () => {
    if(input.trim()=="") return;

    const newTask = {
      title : input,
      
    }

    setTasks([...tasks, input])
    setInput("");
  };

  const deleteTask = (indexToDelete) => {
    const updatedTasks = tasks.filter((_, index) => index!= indexToDelete)
    setTasks(updatedTasks);
  }

  useEffect(()=> {
    const saved = localStorage.getItem("tasks");

    if(saved){
      setTasks(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

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
        {tasks.map((task,index) => (
          <li key={index}>
            {task}
            <button onClick={() =>{
              deleteTask(index)
            }}>Delete</button>          
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
