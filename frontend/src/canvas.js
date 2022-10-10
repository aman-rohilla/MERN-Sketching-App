import React, { useRef, useEffect, useState } from 'react'
import { generateColor, clearCanvas, drawImage } from './utils'
import {axios, baseURL} from './vars'

const Canvas = props => {
  const [dummy, setDrawImage] = useState(false)
  const canvasRef = useRef(null)
  const [state, setState] = React.useState({
    isPainting: false,
    ctx: null,
    startX: 0,
    startY: 0,
  })


  const draw = e => {
    if(!state.isPainting) {
      return;
    }
    const canvas = canvasRef.current
    state.ctx.lineWidth = 1;
    state.ctx.lineCap = 'round';

    const canvasOffsetY = canvas.offsetTop;  
    state.ctx.lineTo(e.clientX, e.clientY - canvasOffsetY);
    state.ctx.stroke();
    
  }

  const mouseDownHandler = (e) => {
    state.isPainting = true
    state.startX = e.clientX;
    state.startY = e.clientY;
  }

  const mouseUpHandler = e => {
    state.isPainting = false;
    state.ctx.stroke();
    state.ctx.beginPath();
  }

  
  function loadImage(url) {
    return new Promise((resolve, reject) => {
      let img = new Image()
      img.addEventListener('load', resolve(img))
      img.addEventListener('error', reject(new Error(`Failed to load the image ${url}`)))
      img.src = url
      img.crossOrigin = baseURL
    })
  }

  const [render, setRender] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    state.ctx = canvas.getContext('2d')
    
    const canvasOffsetX = canvas.offsetLeft;
    const canvasOffsetY = canvas.offsetTop;

    canvas.width = window.innerWidth - canvasOffsetX;
    canvas.height = window.innerHeight - canvasOffsetY;
    window.canvas = canvas

    
    canvas.getContext('2d').strokeStyle = generateColor();

    window.addEventListener('resize', () => {
      const canvasOffsetX = window.canvas.offsetLeft;
      const canvasOffsetY = window.canvas.offsetTop;
  
      window.canvas.width = window.innerWidth - canvasOffsetX;
      window.canvas.height = window.innerHeight - canvasOffsetY;
    })

    window.addEventListener('loadImage', async (event) => {
      const sketch = event.sketch
      const imgUrl = `${baseURL}/api/sketch/${sketch.sketchID}`
      try {
        const img = await loadImage(imgUrl)
        const e = new Event('updateSketchTitle')
        e.sketch = event.sketch
        window.dispatchEvent(e)
        clearCanvas()
        drawImage(img)
        setDrawImage(true)
      } catch (error) {
        console.log(error.message)
      }
    })
  }, [])


  
  return <canvas ref={canvasRef} {...props} onMouseDown={mouseDownHandler} onMouseUp={mouseUpHandler} onMouseMove={draw}/>
}

export default Canvas