import { useState, useEffect } from "react";
import { DndContext } from "@dnd-kit/core";


const handleDragEnd = (event) => {
  const {active, over} = event;

  if(!over) return;

  const taskId = active.id;
  const newStatus = over.id;

  
}

function App() {

  // text typed in add input
  const [input, setInput] = useState("");

  // all tasks
  const [tasks, setTasks] = useState([]);

  // which task is being edited (null = none)
  const [editingTask, setEditingTask] = useState(null);

  // text while editing
  const [editInput, setEditInput] = useState("");


  // =========================
  // ADD TASK
  // =========================
  const addTask = () => {
    if (input.trim() === "") return;

    const newTask = {
      id: Date.now(), //unique id
      title: input,
      status: "Todo"
    };

    setTasks([...tasks, newTask]);
    setInput("");
  };


  // =========================
  // DELETE TASK
  // =========================
  const deleteTask = (id) => {
    const updated = tasks.filter(task => task.id !== id);
    setTasks(updated);
  };


  // =========================
  // MOVE TASK
  // =========================
  const moveTask = (id, newStatus) => {
    const updated = tasks.map(task =>
      task.id === id
        ? { ...task, status: newStatus }
        : task
    );

    setTasks(updated);
  };


  // =========================
  // SAVE EDIT
  // =========================
  const saveEdit = (id) => {
    const updated = tasks.map(task =>
      task.id === id
        ? { ...task, title: editInput }
        : task
    );

    setTasks(updated);
    setEditingTask(null); // stop editing
  };


  // =========================
  // LOAD FROM localStorage
  // =========================
  useEffect(() => {
    const saved = localStorage.getItem("tasks");

    if (saved) {
      setTasks(JSON.parse(saved));
    }
  }, []);


  // =========================
  // SAVE TO localStorage
  // =========================
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);


  // =========================
  // UI
  // =========================
  return (
    <div>
      <h1>TaskFlow</h1>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter task"
      />

      <button onClick={addTask}>Add</button>


      <DndContext onDragEnd={handleDragEnd}>
    
      </DndContext>

      
    </div>
  );
}

export default App;
