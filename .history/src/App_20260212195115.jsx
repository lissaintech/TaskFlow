import { useState, useEffect } from "react";
import {
  DndContext,
  useDroppable,
  useDraggable
} from "@dnd-kit/core";

function App() {
  const [search, setSearch] = useState("");
  const [input, setInput] = useState("");
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [editInput, setEditInput] = useState("");

  // =========================
  // ADD TASK
  // =========================
  const addTask = () => {
    if (input.trim() === "") return;

    const newTask = {
      id: Date.now(),
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
    setTasks(tasks.filter(task => task.id !== id));
  };

  // =========================
  // SAVE EDIT
  // =========================
  const saveEdit = (id) => {
    setTasks(
      tasks.map(task =>
        task.id === id
          ? { ...task, title: editInput }
          : task
      )
    );
    setEditingTask(null);
  };

  // =========================
  // DRAG END
  // =========================
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) return;

    const taskId = active.id;
    const newStatus = over.id;

    setTasks(prev =>
      prev.map(task =>
        task.id === taskId
          ? { ...task, status: newStatus }
          : task
      )
    );
  };

  // =========================
  // LOCAL STORAGE
  // =========================
  useEffect(() => {
    const saved = localStorage.getItem("tasks");
    if (saved) {
      setTasks(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // =========================
  // COLUMN COMPONENT
  // =========================
  function Column({ status, children }) {
    const { setNodeRef } = useDroppable({
      id: status
    });

    return (
      <div
        ref={setNodeRef}
        style={{
          minWidth: "220px",
          minHeight: "300px",
          padding: "10px",
          border: "1px solid gray",
          borderRadius: "8px"
        }}
      >
        <h3>{status}</h3>
        {children}
      </div>
    );
  }

  // =========================
  // TASK COMPONENT
  // =========================
  function Task({ task, children }) {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform
    } = useDraggable({
      id: task.id
    });

    const style = transform
      ? {
          transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`
        }
      : undefined;

    return (
      <div
        ref={setNodeRef}
        style={{
          ...style,
          marginBottom: "8px",
          padding: "8px",
          border: "1px solid black",
          borderRadius: "6px",
          backgroundColor: "white",
          cursor: "grab"
        }}
        {...listeners}
        {...attributes}
      >
        {children}
      </div>
    );
  }



  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(search.toLowerCase())
  );
  

  // =========================
  // UI
  // =========================
  return (
    
    <div style={{ padding: "20px" }}>
      <h1>TaskFlow</h1>

      <input
        placeholder="Search tasks..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginLeft: "10px" }}
      />


      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter task"
      />
      <button onClick={addTask}>Add</button>

      <DndContext onDragEnd={handleDragEnd}>
        <div class
          style={{
            display: "flex",
            gap: "40px",
            marginTop: "20px"
          }}
        >
          {["Todo", "Doing", "Done"].map(status => (
            <Column key={status} status={status}>
              {filteredTasks.filter(task => task.status === status)
                .map(task => (
                  <Task key={task.id} task={task}>
                    {editingTask === task.id ? (
                      <>
                        <input
                          value={editInput}
                          onChange={(e) =>
                            setEditInput(e.target.value)
                          }
                        />
                        <button
                          onClick={() =>
                            saveEdit(task.id)
                          }
                        >
                          💾
                        </button>
                      </>
                    ) : (
                      <>
                        <span>{task.title}</span>
                        <button
                          onClick={() => {
                            setEditingTask(task.id);
                            setEditInput(task.title);
                          }}
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() =>
                            deleteTask(task.id)
                          }
                        >
                          ❌
                        </button>
                      </>
                    )}
                  </Task>
                ))}
            </Column>
          ))}
        </div>
      </DndContext>
    </div>
  );
}

export default App;
