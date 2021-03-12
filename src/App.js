import Header from './components/Header'
import Tasks from './components/Tasks'
import AddTask from './components/AddTask'
import Footer from './components/Footer'
import About from './components/About'

import {useState, useEffect} from 'react'
import {BrowserRouter as Router, Route} from 'react-router-dom'
//import React from 'react';

/*class App extends React.Component {
  render(){
    return <h1> Hello From A Class Comp </h1>
  }
}*/
const  App = () => {

  const [showAddTask, setshowAddTask] = useState(false)
  const [tasks, setTasks] = useState([])

  useEffect(()=>{
    const getTasks = async () =>{
      const taskfromServer = await fetchTasks()
      setTasks(taskfromServer)
    }
    getTasks()
  }, [])


  //Fetch Task
  const fetchTasks = async () =>{
    const response = await fetch('http://localhost:5000/tasks')
    const data = await response.json()
    return data
  }

//Add Task 
const addTask = async (task) =>{
  const res = fetch('http://localhost:5000/tasks',{
    method: 'POST',
    headers:{
      'Content-type':'application/json'
    },
    body: JSON.stringify(task)

  })
  const data = await res.json()

  setTasks([...tasks, data])
    
    /*const id = Math.floor(Math.random() * 1000)+1
    const newTask = {id, ...task}

    setTasks([...tasks, newTask])*/
}

const deleteTask =  async (id) =>{
   await fetch(`http://localhost:5000/tasks/${id}`,{
     method: 'DELETE'
   })
   setTasks(tasks.filter((task)=> task.id !== id ))
}

const fetchTask = async (id) =>{
  const response = await fetch(`http://localhost:5000/tasks/${id}`)
  const data = await response.json()
  return data
}


const toggleReminder = async (id) =>{

  const taskToToggle = await fetchTask(id)
  const updaTask = {...taskToToggle, reminder: !taskToToggle.reminder}

  const res = await fetch(`http://localhost:5000/tasks/${id}`, {
    method: 'PUT',
    headers:{
      'Content-type':'application/json'
    },
    body: JSON.stringify(updaTask)

  })
  const data = await res.json()
    setTasks(tasks.map((task)=> task.id === id ? 
    { ...task, reminder: data.reminder} : task))
}
  return (
    <Router>
    <div className="container">

      <Header onAdd={ ()=>{
        setshowAddTask(!showAddTask)
      }} showAdd = {showAddTask}/>

      {showAddTask && <AddTask onAdd={addTask} />}

      <Route path="/" exact render={ (props)=>{
        <>
        {tasks.length >0 ? (<Tasks tasks={tasks} 
          onDelete={deleteTask} onToggle ={toggleReminder}  /> ) :
          ('No Tasks To Show')}
        
        </>

      }}/>
      

      <Route path="/about" component={About}/>
      <Footer />
      
    </div>
    </Router>
    
  );
}

export default App;
