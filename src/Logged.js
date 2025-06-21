import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  where
} from "firebase/firestore";
import "./index.css";
import taskImg from "./images/evolution-tasks.svg"
import editImg from "./images/pen2.svg"

const Logged = (props) => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const taskRef = collection(db, "tasks");

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
    
  }, [darkMode]);

//on Opening
  useEffect(() => {
    fetchTasks();
  }, []);
  
// CRUD functions
  const fetchTasks = async () => {
    props.setLoading(true);
    const u = props.userState;
    try {
      const q = query(taskRef,where("user","==",u));
      const data = await getDocs(q);
      setTasks(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    } catch (err) {
      props.handleError("Failed to fetch tasks", err);
    } finally {
      props.setLoading(false);
    }
  };

  const fetchTasksSilently = async () => {
    const u = props.userState;
    try {
      const q = query(taskRef,where("user","==",u));
      const data = await getDocs(q);
      setTasks(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    } catch (err) {
      props.handleError("Failed to refresh tasks", err);
    }
  };
  
  const addTask = async () => {
    if (!newTask.trim()) return;
    try {
      await addDoc(taskRef, {
        description: newTask,
        isCompleted: false,
        createdAt: serverTimestamp(),
        user:props.userState
      });
      setNewTask("");
      fetchTasks();
      props.showToastMessage("Task added!");
    } catch (err) {
      props.handleError("Failed to add task", err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await deleteDoc(doc(db, "tasks", id));
      fetchTasks();
      props.showToastMessage(" Task deleted!", "error");
    } catch (err) {
      props.handleError("Failed to delete task", err);
    }
  };

  const toggleTask = async (task) => {
    try {
      await updateDoc(doc(db, "tasks", task.id), {
        isCompleted: !task.isCompleted,
      });
      fetchTasksSilently();
    } catch (err) {
      props.handleError("Failed to update task", err);
    }
  };

  const saveEdit = async (task) => {
    if (!editText.trim()) return;
    try {
      await updateDoc(doc(db, "tasks", task.id), {
        description: editText,
      });
      setEditingId(null);
      fetchTasksSilently();
      props.showToastMessage(" Task updated!");
    } catch (err) {
      props.handleError("Failed to edit task", err);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.isCompleted;
    if (filter === "incomplete") return !task.isCompleted;
    return true;
  });

  const Logout = (e) => {
    e.preventDefault();
    props.setlogged(false);
    props.showToastMessage("Logged Out");
  }
  return (
    <div className="container">
      <button className="logout-btn" onClick={(e)=>{Logout(e)}}></button>
      <h1 className="app-heading">
        <img src={taskImg} alt="Task" className="icon" />
        Task Manager
        <button
          className="dark-toggle"
          onClick={() => setDarkMode((prev) => !prev)}
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
      </h1>

      <div>
        <input
          type="text"
          value={newTask}
          placeholder="Enter a new task..."
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
        />
        <button onClick={addTask}>Add</button>
      </div>

      <div className="filters">
        <button
          className={filter === "all" ? "selected" : ""}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={filter === "completed" ? "selected" : ""}
          onClick={() => setFilter("completed")}
        >
          Completed
        </button>
        <button
          className={filter === "incomplete" ? "selected" : ""}
          onClick={() => setFilter("incomplete")}
        >
          Incomplete
        </button>
      </div>

      <ul className="task-list">
        {filteredTasks.map((task) => (
          <li className="task-item" key={task.id}>
            {editingId === task.id ? (
              <input
                className="edit-input"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onBlur={() => saveEdit(task)}
                onKeyDown={(e) =>
                  e.key === "Enter"
                    ? saveEdit(task)
                    : e.key === "Escape"
                      ? setEditingId(null)
                      : null
                }
                autoFocus
              />
            ) : (
              <div
                className={`task-card ${task.isCompleted ? "completed" : "incomplete"}`}
                onClick={() => toggleTask(task)}
              >
                <div className="task-desc">{task.description}</div>
                <div className="task-time">
                  {task.createdAt?.seconds
                    ? new Date(task.createdAt.seconds * 1000).toLocaleString()
                    : "Just now"}
                </div>
              </div>
            )}
            <button
            className="edit-btn"
            onClick={() => {
              setEditingId(task.id);
              setEditText(task.description);
            }}
          >
            <img src={editImg} alt="pencil"/>
          </button>
            <button className="delete-btn" onClick={() => deleteTask(task.id)}>
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Logged;
