import { useEffect, useState } from 'react'

function App() {

  const [input, setInput] = useState("");

  const [tasks, setTasks] = useState([]);

  const [editingTask, setEditingTask] = useState(null);

  const [editInput, setEditInput] = useState("");

  const addTask = () => {
    if(input.trim()=="") return;

    const newTask = {
      title : input,
      status : "Todo"
    }

    setTasks([...tasks, newTask])
    setInput("");
  };

  const deleteTask = (taskToDelete) => {
    const updatedTasks = tasks.filter(task => task!== taskToDelete)
    setTasks(updatedTasks);
  }

  const moveTask = (taskToMove, newStatus) => {
    const updatedTasks = tasks.map(task => 
      (task == taskToMove)? {...task, status:newStatus} : task)
    setTasks(updatedTasks);
  }

  const saveEdit = (taskToEdit, newTitle) => {
    const updatedTasks = task.map(task =>
      task === taskToEdit?
      {...task, title: newTitle}
      : task
    );

    setTasks(updatedTasks);
    setEditingTask(null);
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

      <div style={{display: "flex", gap: "40px"}}>

        {
          ["Todo", "Doing", "Done"].map((status)=>(
            <div key={status}>
              <h3>{status}</h3>
              {tasks
              .filter(task => task.status === status)
              .map((task) => (
                <div key={task.title}>
                   
                   {
                  editingTask === task
                    ? <input value={task.title} />
                    : <span>{task.title}</span>
                }

                  {status!= "Done" && (
                    <button onClick={()=>
                      moveTask(task, status === "Todo"? "Doing":"Done")
                    }>➡️</button>
                  )}

                  <button onClick={()=> deleteTask(task)}>❌</button>

                  <button onClick={() => setEditingTask(task)}>
                    ✏️
                  </button>



                </div>
                
              ))
              }
            </div>
          ))
        }

      </div>
    </div>
  );
}

export default App;
