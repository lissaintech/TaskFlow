import { useState } from 'react'

function App() {

  // const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");



  return (
  <div>
    <h1>TaskFlow</h1>
    <input 
    value={input}
    onChange={(e)=> {
      setInput(e.target.value)
    }
    placeholder = "Enter task"
  }
    />
  </div>
  )
}

export default App