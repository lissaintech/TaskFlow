import "./App.css";
import { db, auth } from "./firebase";
import {
  collection,
  addDoc,
  query,
  where,
  deleteDoc,
  doc,
  updateDoc,
  onSnapshot
} from "firebase/firestore";

import {
  DndContext,
  useDroppable,
  useDraggable,
  DragOverlay
} from "@dnd-kit/core";

import { useState, useEffect } from "react";

function Dashboard() {
  const [search, setSearch] = useState("");
  const [input, setInput] = useState("");
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [editInput, setEditInput] = useState("");
  const [activeTask, setActiveTask] = useState(null);

  const [viewMode, setViewMode] = useState("my"); 
// "my" | "team"


  // =========================
  // ADD TASK
  // =========================
  const addTask = async () => {
    if (input.trim() === "") return;
    if (!auth.currentUser) return;

    const newTask = {
      title: input,
      status: "Todo",
      ownerId: auth.currentUser.uid,
      createdAt: new Date()
    };

    await addDoc(collection(db, "tasks"), newTask);
    setInput("");
  };

  // =========================
  // DELETE TASK
  // =========================
  const deleteTask = async (id) => {
    await deleteDoc(doc(db, "tasks", id));
  };

  // =========================
  // SAVE EDIT
  // =========================
  const saveEdit = async (id) => {
    await updateDoc(doc(db, "tasks", id), {
      title: editInput
    });

    setEditingTask(null);
  };

  // =========================
  // DRAG END
  // =========================
  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over) return;

    await updateDoc(doc(db, "tasks", active.id), {
      status: over.id
    });

    setActiveTask(null);
  };

  // =========================
  // REAL-TIME TASK LISTENER
  // =========================
  useEffect(() => {
    if (!auth.currentUser) return;
  
    let q;
  
    if (viewMode === "my") {
      q = query(
        collection(db, "tasks"),
        where("ownerId", "==", auth.currentUser.uid)
      );
    } else {
      q = query(collection(db, "tasks"));
    }
  
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setTasks(tasksData);
    });
  
    return () => unsubscribe();
  }, [viewMode]);
  

  // =========================
  // COLUMN COMPONENT
  // =========================
  function Column({ status, children }) {
    const { setNodeRef } = useDroppable({ id: status });

    return (
      <div
        ref={setNodeRef}
        className="column"
        style={{
          minWidth: "220px",
          minHeight: "300px",
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "10px",
          background: "#f6f8f6"
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
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
      id: task.id
    });

    const style = {
      transform: transform
        ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
        : undefined,
      transition: "transform 300ms ease"
    };

    return (
      <div
        ref={setNodeRef}
        className="task-card"
        style={{
          ...style,
          display: "flex",
alignItems: "flex-start",
gap: "8px"
          padding: "8px",
          marginBottom: "8px",
          background: "white",
          borderRadius: "8px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
        }}
      >
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

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app">
      <h1>TaskFlow</h1>

      <div className="top-bar" style={{ marginBottom: "20px" }}>
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

      <DndContext
        onDragStart={(event) => {
          const task = tasks.find((t) => t.id === event.active.id);
          setActiveTask(task);
        }}
        onDragEnd={handleDragEnd}
      >

        <div style={{ marginBottom: "20px" }}>
        <button
            onClick={() => setViewMode("my")}
            style={{
            marginRight: "10px",
            background: viewMode === "my" ? "#8FBF9F" : "#ddd"
            }}
        >
            My Board
        </button>

        <button
            onClick={() => setViewMode("team")}
            style={{
            background: viewMode === "team" ? "#8FBF9F" : "#ddd"
            }}
        >
            Team Board
        </button>
        </div>

        <div
          className="board"
          style={{
            display: "flex",
            gap: "20px"
          }}
        >
          {["Todo", "Doing", "Done"].map((status) => (
            <Column key={status} status={status}>
              {filteredTasks
                .filter((task) => task.status === status)
                .map((task) => (
                  <Task key={task.id} task={task}>
                    {editingTask === task.id ? (
                    <>
                        <input
                        value={editInput}
                        onChange={(e) => setEditInput(e.target.value)}
                        />
                        <button onClick={() => saveEdit(task.id)}>💾</button>
                    </>
                    ) : (
                    <>
                        {/* 👇 ADD THIS RIGHT HERE */}
                        {viewMode === "team" && (
                        <div style={{ fontSize: "12px", opacity: 0.6 }}>
                            {task.ownerId === auth.currentUser.uid ? "You" : task.ownerId}
                        </div>
                        )}
                        {/* 👆 END OWNER LABEL */}

                        <span>{task.title}</span>

                        {task.ownerId === auth.currentUser.uid && (
                        <>
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
                    </>
                    )}

                  </Task>
                ))}
            </Column>
          ))}
        </div>

        <DragOverlay>
          {activeTask ? (
            <div
              style={{
                padding: "8px",
                background: "white",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
              }}
            >
              {activeTask.title}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

export default Dashboard;