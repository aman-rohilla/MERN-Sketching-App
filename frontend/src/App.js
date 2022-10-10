import './App.css';
import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Login from './auth/login'
import Register from './auth/register'
import Home from './home'

const CreateTask = () => {
  const [name, setName] = useState('')

  const submitHandler = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post('http://192.168.0.105', {name})
      window.location.reload()
    } catch (error) {
      alert('Something went wrong')
    }
  }

  return <>
    <h4 className='mb-4 text-center'>Create New Task</h4>
    <form className='d-flex' style={{gap: '10px'}} onSubmit={submitHandler}>
      <input type='text' className='form-control' value={name} onChange={(e) => setName(e.target.value)}/>
      <button type='submit' className='btn btn-success'>Add</button>
    </form>
  </>
}

const EditTask = ({ task, setTasks, tasks }) => {
  const [name, setName] = useState(task.name);
  const taskID = task.id;

  const updateName = async e => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://192.168.0.105/${task.id}`, {name})
      setTasks(tasks.map(task => {
        if(task.id == taskID) {
          task.name = name
        }
        return task
      }))
      // window.location = "/";
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <>
      <button type="button" className="btn btn-warning" data-toggle="modal" data-target={`#taskID-${task.id}`}>
        Edit
      </button>

      <div className="modal" id={`taskID-${task.id}`}>

        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title text-dark">Edit task</h4>
              <button type="button" className="close" data-dismiss="modal">
                &times;
              </button>
            </div>

            <div className="modal-body">
              <input type="text" className="form-control" value={name} onChange={e => setName(e.target.value)}/>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-warning" data-dismiss="modal" onClick={e => updateName(e)}>
                Update
              </button>
              <button type="button" className="btn btn-danger" data-dismiss="modal">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const ShowAllTasks = () => {
  const [tasks, setTasks] = useState([])

  const getAllTasks = async () => {
    try {
      const response = await axios.get('http://192.168.0.105')
      setTasks(response.data)
    } catch (error) {
      console.log(error);
    }
  }
  
  const deleteTask = async (id) => {
    try {
      const response = await axios.delete(`http://192.168.0.105/${id}`)
      setTasks(tasks.filter(task => task.id !== id))
    } catch (error) {
      console.log(error);
    }
  }


  useEffect(() => {
    getAllTasks()
  }, [])
  
  const tasksMapped = tasks.map((task) => {
    return <>
      <div className='list-item' key={task.id}>
        {task.name}
        <div>
          <div className='btn-group' role="group" aria-label="Basic example">
            <EditTask task={task} setTasks={setTasks} tasks={tasks} />
            <button type='button' className='btn btn-danger btn-sm' onClick={() => deleteTask(task.id)}>Del</button>
          </div>
        </div>
      </div>
    </>
  })

  return <>
    <h2 className='mt-5 mb-3'>Your Tasks</h2>
    {tasksMapped}
  </>
}

// function App() {
//   return ( 
//     <div className='center-item'>
//       <Login />
//     </div>
//   );
// }

function NotFound() {
  return <>Route doesn't exist</>
}


function App() {

  return (
    <Router>
      <Switch>

        <Route exact path='/'> <Home /> </Route>
        <Route path='/login'> 
          <div className='center'>
            <div className='center-item'> <Login/> </div>
          </div>
        </Route>
        <Route path='/register'>  
          <div className='center'>
            <div className='center-item'> <Register/> </div>
          </div>
        </Route>
        <Route path='*'> <NotFound /> </Route>

      </Switch>
    </Router>
  );
};


export default App;
