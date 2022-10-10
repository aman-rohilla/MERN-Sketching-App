import { v4 as uuid } from 'uuid';

function isEmailValid(email) {
  const matches = email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
  if(matches) return true
  return false
}

function alertMessage(messages, setAlerts, css={}) {  
  let arr = Array.isArray(messages) ? messages : [messages]
  arr = arr.map(message => {
    const id = uuid().toString()
    return {...message, id}
  })

  if(!css.paddingTop) css.paddingTop = '5px'
  if(!css.paddingBottom) css.paddingBottom = '5px'

  return arr.map(({message, category, id}) => {
    return <div key={id} className={`container mt-0 mb-2 alert alert-${category} alert-dismissible fade show px-3`} role="alert" style={css}>

      <div className="d-flex justify-content-between align-items-center"> 
      <div className="message">{message}</div>
      
      <button id={id} type="button" className="close ml-3" data-dismiss="alert" aria-label="Close" style={{position: 'relative', padding: '7px'}} onClick={(event) => {
        setAlerts(arr.filter(({id}) => id != event.currentTarget.id))
      }}>
        <span aria-hidden="true">&times;</span>   
      </button>
      </div>
    </div>   
  })
}

window.getUsername = () => {
  const match = document.cookie.match(new RegExp('(^| )username=([^;]+)'));
  if (match) return match[2];
}

let match = document.cookie.match(new RegExp('(^| )userID=([^;]+)'));
if (match) {
  const userID = decodeURI(match[2])
  window.userID = userID.match(new RegExp(/"(.*)"/))[1]
}




const Spin = () => {
  return <div className="spinner spinner-border spinner-border-sm my-auto" role="status" aria-hidden="true" style={{height: '20px', width: '20px', fontSize: '12px'}}></div>
}


// function generateColor(n=0){
//   let color = 0xFFFFFF + n*1000
//   color = color.toString(16).padStart(6, 0);   
//   return `#${color.toUpperCase()}`
// }

// const colors = ['white', '', 'red', 'green', 'purple', 'pink']
const colors = ['white', '#ffaa00', '#ccff00', '#ebf5fe', '#66ccff', '#ff9966', '#254661']
function generateColor(n=0) {
  return colors[n]
}


const clearCanvas = () => window.canvas.getContext('2d').clearRect(0, 0, window.canvas.width, window.canvas.height)
const drawImage = (img) => {
  window.canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);
}

export {isEmailValid, alertMessage, Spin, generateColor, clearCanvas, drawImage}

