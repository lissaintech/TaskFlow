import { useEffect, useState } from 'react'

function App() {

  const [input, setInput] = useState("");

  const [tasks, setTasks] = useState([]);

  const addTask = () => {
    if(input.trim()=="") return;

    const newTask = {
      title : input,
      status : "Todo"
    }

    setTasks([...tasks, newTask])
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
    
      <div style={{display:"flex",gap: "40px"}}>

        {/* TODO */}

        <div>
          <h3>Todo</h3>
          {
            tasks
            .filter(task => task.status = "Todo")
            .map((task, index)=>{
              {task.title}
              <button onClick={}></button>
            })

          }
        </div>

        {/*DOING */}
        <div>

        </div>
      </div>
    </div>
  );
}

export default App;
