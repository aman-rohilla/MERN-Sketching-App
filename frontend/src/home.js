import './home.css'
import React, {useEffect, useState, useRef} from 'react';
import Canvas from './canvas.js';
import {axios, baseURL} from './vars.js'
import {Spin, generateColor, clearCanvas} from './utils.js'



function Home() {
  const username = window.getUsername()


  if(!username) window.location = '/login'
  // return <>Welcome, {username} </>
  
  const [sketchTitle, setSketchTitle] = useState('Untitled')
  const [sketchUser, setSketchUser] = useState('You \u2713')
  const [tempSketchTitle, setTempSketchTitle] = React.useState('Untitled')
  const [color, setColor] = useState('#000000')

  const [spin, setSpin] = useState(false)
  // const [spinSketchTitle, setSpinSketchTitle] = useState(false)


  const save = async () => {
    setSpin(true)
    const img = window.canvas.toDataURL('image/png');
    const data = new FormData();
    data.append('image', img)
    data.append('title', sketchTitle)
    try {    
      const res = await axios({
        url: window.sketch ? `/api/sketch/${window.sketch.sketchID}` : `/api/sketch`,
        method: window.sketch ? 'PATCH' : 'POST',
        data: data,
        contentType: 'image/png',
      })
      window.sketch = res.data.sketch
      // console.log(window.sketch);
      window.dispatchEvent(new Event('updateSketches'))
    } catch (error) {
      console.log(error.message)
    }
    setSpin(false)
  }

  
  const logout = async () => {
    localStorage.removeItem('token')

    try {
      await axios.get('/api/logout')
      window.location = '/login'
    } catch (error) {
      console.log(error.message)
    }
  }

  const titleInputRef = useRef(null)
  const [isEditTitle, setEditTitle] = useState(false)

  const editHandler = (e) => {
    setEditTitle(false)
    setSketchTitle(tempSketchTitle)
  }

  useEffect(() => {
    window.addEventListener('updateSketchTitle', event => {
      if(!event.sketch) {
        setSketchTitle('Untitled')
        setSketchUser('You \u2713')
        return
      }

      const sketch = event.sketch
      setSketchTitle(sketch.title)
      if(sketch.sketchUserID == window.userID)
        setSketchUser('You \u2713')
      else
        setSketchUser(sketch.sketchUserName)
    })
  })

  const [lastColor, setLastColor] = React.useState('#FFFFFF')
  const [colors, setLastColors] = React.useState(['#FFFFFF'])


  // const colorHandler = (e) => {
  //   window.canvas.getContext('2d').strokeStyle = e.target.value
  //   setColor(e.target.value)
  // }

  
  return <>
    <div>
      <header className='header'>
        <div className='username'>Welcome, <span>{username}</span></div>
        <img src="https://img.icons8.com/bubbles/100/000000/user.png" alt='user-logo' width='50px' />
        <button className='btn btn-light btn-sm' onClick={logout} style={{paddingLeft: '8px', paddingRight: '8px'}}>
          <i className="fa-solid fa-right-from-bracket fa-xl"></i>
        </button>
      </header>


      <div className='panel'>

        <div className='d-flex' style={{width: '100%', paddingTop: '5px', paddingBottom: '5px'}}>
          <div className='panel-title'>
          { !isEditTitle ?
              <>
                {sketchTitle}
                <i className="fa-solid fa-pen ml-3" style={{fontSize: '16px', color: 'yellow'}} onClick={() => setEditTitle(true)}></i>
              </>
            :
            <form className='panel-form' onSubmit={editHandler}>      
              <div className="form-group" style={{height: '30px', padding: '0', margin: '0'}}>
                <input type="text" className="form-control my-auto" placeholder="" value={tempSketchTitle}  onChange={(e)=>{setTempSketchTitle(e.target.value)}} />
              </div>
  
              <i className="fa-regular fa-square-check fa-xl my-auto" onClick={editHandler}></i>

            </form> 
          }
            <div style={{fontSize: '14px'}}>
              <i className="fa-solid fa-user mr-2"></i>
              {sketchUser}
            </div>
          </div>


          <div className='panel-items my-auto' style={{height: '30px'}}>
            {/* <input className='color' type="color" value={color} onChange={colorHandler}/> */}
            {/* <button className='btn btn-danger btn-sm' onClick={load}>Test</button> */}
            <button className='btn btn-danger btn-sm' onClick={clearCanvas}>Clear</button>

            <button className='btn btn-success btn-sm' style={{width: '60px'}} onClick={save}>
              {!spin ? 'Save' : <Spin /> }
            </button>
          </div>
        </div>


        <Sketch />
      </div>

      <div>
        <Canvas />
      </div>


    </div>
  </>
}


const Sketch = () => {
  const [sketches, setSketches] = useState([])

  useEffect(() => {

    async function fetchSketches () {
      try {
        const res = await axios.get('/api/sketch')
        setSketches(res.data.sketches)
        window.sketches = res.data.sketches
      } catch (error) {
  
      }
    }
    if(!window.dom.once) {
      
      window.addEventListener('updateSketches', () => {
        if(window.sketches) {
          window.sketches = window.sketches.filter(sketch => sketch.sketchID != window.sketch.sketchID)
          window.sketches.push(window.sketch)
        } else {
          window.sketches = [window.sketch]
        }
        setSketches(window.sketches)
      })
      
      fetchSketches()
      window.dom.once = true
    }
      


  }, [])

  const sketchMapper = () => {
    return <ul className="list-group list-group-light">
      {sketches.map((sketch, index) => {
        return <li key={sketch.sketchID} className="list-group-item" 
        style={{color: sketch.sketchID == window.activeSketchID ? 'red' : 'inherit'}}

        onClick={() => {
          const event = new Event('loadImage')
          event.sketch = sketch
          window.dispatchEvent(event)
          window.sketch = sketch
          window.activeSketchID = sketch.sketchID

          if(sketch.sketchUserID != window.userID) {
            let index = sketch.members.findIndex(member => member.memberID == window.userID)
            if(index == -1) {
              index = sketch.members.length
            }
            window.canvas.getContext('2d').strokeStyle = generateColor(1 + index);
            // console.log(generateColor(1+index));
          } else {
            window.canvas.getContext('2d').strokeStyle = generateColor();
          }
            
        }}
        >
            {sketch.title}
        </li>
      })}

      <li key='sdkjfjvddshukfvh' className="list-group-item" 
        style={{color: 'green'}}

        onClick={() => {
          window.sketch = undefined
          window.activeSketchID = undefined
          clearCanvas()

          window.dispatchEvent(new Event('updateSketchTitle'))
        }}
        >
          <i className="fa-solid fa-plus mr-2"></i>
          Add New
      </li>


    </ul>
  }

  const userMapper = () => {

    if(!window.sketch)
    return (
      <ul className="list-group list-group-light">
          <li className="list-group-item d-flex ">
            <div className='dot' style={{backgroundColor: generateColor()}}></div>
            You &#10003;
          </li>
      </ul>
    )


    return <ul className="list-group list-group-light">
      <li key='kdjvhgkjhg' className="list-group-item d-flex">
        <div className='dot' style={{backgroundColor: generateColor()}}></div>
        {window.sketch.sketchID == window.userID ? 'You &#10003;' : window.sketch.sketchUserName}
      </li>

      
      {window.sketch.members.map((member, index) => {
        return <li key={index} className="list-group-item d-flex">
            <div className='dot' style={{backgroundColor: generateColor(1+index)}}></div>
            {window.userID != member.memberID ? member.memberName : 'You'}

        </li>
      })}


    </ul>
  }

  return <>
    <div>
      <div className='sketches'>

        <div className="accordion" id="accordionExample">
          <div className="accordion-item">
            <h2 className="accordion-header" id="headingOne">
              <button
                className="accordion-button"
                type="button"
                data-mdb-toggle="collapse"
                data-mdb-target="#collapseOne"
                aria-expanded="false"
                aria-controls="collapseOne"
              >
                Sketches
              </button>
            </h2>
            <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-mdb-parent="#accordionExample">
              <div className="accordion-body text-dark">
              {sketchMapper()}
              </div>
            </div>
          </div>
          <div className="accordion-item">
            <h2 className="accordion-header" id="headingTwo">
              <button
                className="accordion-button collapsed"
                type="button"
                data-mdb-toggle="collapse"
                data-mdb-target="#collapseTwo"
                aria-expanded="false"
                aria-controls="collapseTwo"
              >
                Users
              </button>
            </h2>
            <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-mdb-parent="#accordionExample">
              <div className="accordion-body text-dark">
              {userMapper()}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

  </>
}


export default Home
