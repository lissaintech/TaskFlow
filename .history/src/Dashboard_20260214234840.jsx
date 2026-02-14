import "./App.css";
import { db, auth } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
  updateDoc
} from "firebase/firestore";



import { useState, useEffect } from "react";
import {
  DndContext,
  useDroppable,
  useDraggable
} from "@dnd-kit/core";

function Dashboard() {
  const [search, setSearch] = useState("");
  const [input, setInput] = useState("");
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [editInput, setEditInput] = useState("");

  // =========================
  // ADD TASK
  // =========================
  const addTask = async () => {
    if (input.trim() === "") return;
  
    const newTask = {
      title: input,
      status: "Todo",
      ownerId: auth.currentUser.uid
    };
  
    const docRef = await addDoc(collection(db, "tasks"), newTask);
  
    setTasks([...tasks, { id: docRef.id, ...newTask }]);
    setInput("");
  };
  

  // =========================
  // DELETE TASK
  // =========================
  const deleteTask = async (id) => {
    await deleteDoc(doc(db, "tasks", id));
    setTasks(tasks.filter(task => task.id !== id));
  };
  

  // =========================
  // SAVE EDIT
  // =========================
  const saveEdit = async (id) => {
    await updateDoc(doc(db, "tasks", id), {
      title: editInput
    });
  
    setTasks(
      tasks.map(task =>
        task.id === id ? { ...task, title: editInput } : task
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
  
  useEffect(() => {
    const fetchTasks = async () => {
      const q = query(
        collection(db, "tasks"),
        where("ownerId", "==", auth.currentUser.uid)
      );
  
      const querySnapshot = await getDocs(q);
      const tasksData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
  
      setTasks(tasksData);
    };
  
    fetchTasks();
  }, []);
  
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
        className={`column column-${status.toLowerCase()}`}
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
  
    const style = {
      transform: transform
        ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
        : undefined,
      transition: "transform 250ms cubic-bezier(0.2, 0.8, 0.2, 1)"
    };
  
    return (
      <div
        ref={setNodeRef}
        className="task-card"
        style={style}
      >
        {/* DRAG HANDLE */}
        <span
          {...listeners}
          {...attributes}
          style={{ cursor: "grab", marginRight: "8px" }}
        >
          ⠿
        </span>
  
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
    <div className="app">
      <h1>TaskFlow</h1>
  
      <div className="top-bar">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter task"
        />
        <button onClick={addTask}>Add</button>
  
        <input
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
  
      <DndContext onDragEnd={handleDragEnd}>
        <div className="board">
          {["Todo", "Doing", "Done"].map(status => (
            <Column key={status} status={status}>
              {filteredTasks
                .filter(task => task.status === status)
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
                        <button onClick={() => saveEdit(task.id)}>
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
                        <button onClick={() => deleteTask(task.id)}>
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

export default Dashboard;
