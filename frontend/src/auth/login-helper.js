import { isEmailValid } from "../utils"
import {axios} from '../vars'

async function loginHelper ({event, setSpin, setAlerts}) {
  event.preventDefault()
  setSpin(true)

  const email = document.getElementById('form-email').value.trim()
  const pass  = document.getElementById('form-pass').value.trim()

  if(!email || !pass) {
    setSpin(false)
    setAlerts([{message: 'Some fields are empty', category: 'warning'}])
    return 
  }
  const password = pass

  let messages = []
  if(! isEmailValid(email))
    messages.push({message: 'Email is invalid', category: 'warning'})  

  if(password.length<8)
    messages.push({message: 'Password is less than 8 characters', category: 'warning'})  

  if(messages.length) {
    setSpin(false)
    setAlerts(messages)
    return
  }

  try {
    setAlerts([])
    const res = await axios.post(`/api/login`, { email, password})
    setSpin(false)

    if(res.data.success == true) {
      event.target.reset()
      event.target.querySelectorAll('input').forEach(el => el.blur())
      setAlerts([{message: res.data.message, category: 'success'}])

/////////      
localStorage.setItem('token', res.data.token)


      await new Promise(resolve => setTimeout(resolve, 2000));
      window.location = '/'
    }
  } catch (error) {
    setSpin(false)
    // setAlerts([{message: 'Something went wrong', category: 'danger'}])
    setAlerts([{message: error.response.data.message || error.message, category: 'danger'}])
  }
}

export default loginHelper