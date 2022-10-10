import { isEmailValid } from "../utils"
import {axios} from '../vars'

async function signupHelper ({event, setSpin, setAlerts}) {
  event.preventDefault()
  setSpin(true)

  const firstName = document.getElementById('form-fname').value.trim()
  const lastName = document.getElementById('form-lname').value.trim()
  const email = document.getElementById('form-email').value.trim()
  const pass  = document.getElementById('form-pass').value.trim()

  if(!firstName || !lastName || !email || !pass) {
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
    const res = await axios.post(`/api/register`, { firstName, lastName, email, password})
    setSpin(false)

    if(res.data.success == true) {
      event.target.reset()
      event.target.querySelectorAll('input').forEach(el => el.blur())
      setAlerts([{message: res.data.message, category: 'success'}])
      await new Promise(resolve => setTimeout(resolve, 2000));
      localStorage.setItem('username', firstName)
      window.location = '/login'
    }
  } catch (error) {
    setSpin(false)
    // setAlerts([{message: 'Something went wrong', category: 'danger'}])
    setAlerts([{message: error.response.data.message || error.message, category: 'danger'}])
  }
}

export default signupHelper