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
  const [users, setUsers] = useState({});
  const [viewMode, setViewMode] = useState("my");
  const [activeTask, setActiveTask] = useState(null);

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
  // REAL-TIME LISTENER
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
        style={{
          minWidth: "260px",
          minHeight: "360px",
          padding: "18px",
          borderRadius: "16px",
          background: "#f3f6f4",
          border: "1px solid #e2e8e4"
        }}
      >
        <h3 style={{ marginBottom: "20px", fontWeight: 600 }}>
          {status}
        </h3>
        {children}
      </div>
    );
  }

  // =========================
  // TASK COMPONENT
  // =========================
  function Task({ task }) {
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
        style={{
          ...style,
          padding: "12px",
          marginBottom: "12px",
          background: "white",
          borderRadius: "12px",
          boxShadow: "0 6px 14px rgba(0,0,0,0.06)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          transition: "all 0.2s ease"
        }}
      >
       <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
  <span
    {...listeners}
    {...attributes}
    style={{ cursor: "grab", fontSize: "18px", opacity: 0.6 }}
  >
    ⠿
  </span>

  <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
    <span style={{ fontWeight: 500 }}>
      {task.title}
    </span>

    {viewMode === "team" && (
      <span
        style={{
          fontSize: "13px",
          color: "#7a8f85",
          fontStyle: "italic"
        }}
      >
        — {task.ownerId === auth.currentUser.uid
            ? "You"
            : auth.currentUser?.email === task.ownerId
            ? "You"
            : task.ownerId}
      </span>
    )}
  </div>
</div>

        {task.ownerId === auth.currentUser.uid && (
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={() => deleteTask(task.id)}
              style={{
                border: "none",
                background: "transparent",
                cursor: "pointer"
              }}
            >
              ❌
            </button>
          </div>
        )}
      </div>
    );
  }

  function StatCard({ label, value }) {
    return (
      <div
        style={{
          padding: "16px 22px",
          background: "white",
          borderRadius: "14px",
          boxShadow: "0 6px 16px rgba(0,0,0,0.05)",
          minWidth: "130px"
        }}
      >
        <div style={{ fontSize: "12px", color: "#6b8e7e" }}>
          {label}
        </div>
        <div style={{ fontSize: "22px", fontWeight: 600 }}>
          {value}
        </div>
      </div>
    );
  }

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      style={{
        maxWidth: "1150px",
        margin: "0 auto",
        padding: "30px"
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "35px"
        }}
      >
        <div>
          <h1 style={{ margin: 0 }}>TaskFlow</h1>
          <div style={{ fontSize: "14px", color: "#6b8e7e" }}>
            Stay focused. Ship faster.
          </div>
        </div>

        <div
          style={{
            background: "#6b8e7e",
            color: "white",
            padding: "8px 16px",
            borderRadius: "20px",
            fontWeight: 500
          }}
        >
          {auth.currentUser?.email}
        </div>
      </div>

      {/* INPUT ROW */}
      <div
  style={{
    display: "flex",
    gap: "16px",
    marginBottom: "28px",
    alignItems: "center"
  }}
>
  <input
    value={input}
    onChange={(e) => setInput(e.target.value)}
    placeholder="Enter task..."
    style={{
      padding: "12px 16px",
      fontSize: "15px",
      borderRadius: "10px",
      border: "1px solid #d8e0dc",
      outline: "none",
      width: "260px",
      background: "white"
    }}
  />

  <button
    onClick={addTask}
    style={{
      padding: "12px 22px",
      fontSize: "15px",
      borderRadius: "10px",
      border: "none",
      cursor: "pointer",
      background: "#6b8e7e",
      color: "white",
      fontWeight: 500,
      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
      transition: "all 0.2s ease"
    }}
  >
    Add Task
  </button>

  <input
    placeholder="Search tasks..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    style={{
      padding: "12px 16px",
      fontSize: "15px",
      borderRadius: "10px",
      border: "1px solid #d8e0dc",
      outline: "none",
      width: "260px",
      background: "white"
    }}
  />
</div>


      {/* TOGGLE */}
      <div
        style={{
          display: "inline-flex",
          background: "#e6efe9",
          padding: "4px",
          borderRadius: "20px",
          marginBottom: "25px"
        }}
      >
        <button
          onClick={() => setViewMode("my")}
          style={{
            padding: "6px 16px",
            borderRadius: "16px",
            border: "none",
            cursor: "pointer",
            background: viewMode === "my" ? "#6b8e7e" : "transparent",
            color: viewMode === "my" ? "white" : "#355f4c"
          }}
        >
          My Board
        </button>

        <button
          onClick={() => setViewMode("team")}
          style={{
            padding: "6px 16px",
            borderRadius: "16px",
            border: "none",
            cursor: "pointer",
            background: viewMode === "team" ? "#6b8e7e" : "transparent",
            color: viewMode === "team" ? "white" : "#355f4c"
          }}
        >
          Team Board
        </button>
      </div>

      {/* STATS */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          marginBottom: "30px"
        }}
      >
        <StatCard label="Total Tasks" value={tasks.length} />
        <StatCard
          label="Todo"
          value={tasks.filter(t => t.status === "Todo").length}
        />
        <StatCard
          label="Doing"
          value={tasks.filter(t => t.status === "Doing").length}
        />
        <StatCard
          label="Done"
          value={tasks.filter(t => t.status === "Done").length}
        />
      </div>

      {/* BOARD */}
      <DndContext
        onDragStart={(event) => {
          const task = tasks.find(t => t.id === event.active.id);
          setActiveTask(task);
        }}
        onDragEnd={handleDragEnd}
      >
        <div style={{ display: "flex", gap: "25px" }}>
          {["Todo", "Doing", "Done"].map((status) => (
            <Column key={status} status={status}>
              {filteredTasks
                .filter((task) => task.status === status)
                .map((task) => (
                  <Task key={task.id} task={task} />
                ))}
            </Column>
          ))}
        </div>

        <DragOverlay>
          {activeTask ? (
            <div
              style={{
                padding: "12px",
                background: "white",
                borderRadius: "12px",
                boxShadow: "0 10px 20px rgba(0,0,0,0.1)"
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
