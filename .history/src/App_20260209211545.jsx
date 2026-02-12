import { useState } from 'react'

function App() {

  // const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");



  return (
  <div>
    <h1>TaskFlow</h1>
    <input 
    value={input}
    onChange={9}
    />
  </div>
  )
}

export default App