import axios from 'axios'
import React, { useState, useEffect } from 'react'
import './login-register.css'
import signupHelper from './signup-helper'
import { alertMessage } from '../utils'

const Register = () => {
  if(window.getUsername()) window.location = '/'


  const [spin, setSpin] = useState(false)
  const [alerts, setAlerts] = useState([])

  const spinnerClass = "float-end spinner spinner-border spinner-border-sm"

  const signupHandler = (event) => {
    signupHelper({event, setSpin, setAlerts})
  }

  return (
  <div id="signup-form-div" className="mx-auto">
    <div className="form-main">
        
      <div className='form-header'>Create New Account</div>

      
      <form onSubmit={signupHandler}>
        <div id="form-alerts">{alerts.length ? alertMessage(alerts, setAlerts): <></>}</div>

        <div className="form-group">
          <label htmlFor="form-fname">First Name</label>
          <input type="text" className="form-control" id="form-fname" name="fname" placeholder="" />
        </div>
        <div className="form-group">
          <label htmlFor="form-lname">Last Name</label>
          <input type="text" className="form-control" id="form-lname" name="lname" placeholder="" />
        </div>
        <div className="form-group">
          <label htmlFor="form-email">Email</label>
          <input type="text" className="form-control" id="form-email" name="email" placeholder="" />
        </div>
        <div className="form-group">
          <label htmlFor="form-pass">Password </label>
          <input type="password" className="form-control" id="form-pass" name="password" placeholder=" "/>
        </div>

        <div className="pt-3 pb-2 justify-content-center">
        <button id="form-submit-btn" type="submit" className="btn btn-primary btn-sm btn-block border border-dark d-flex justify-content-start align-items-center btn-block"
          style={{height: '40px', backgroundColor: 'darkcyan'}}>
          <div className="clearfix spinner-div" style={{width: '33%', fontSize: '12px'}}>
            <span className={spin ? spinnerClass : spinnerClass + ' d-none'} role="status" aria-hidden="true" style={{height: '20px', width: '20px'}}></span>
          </div>
          <div className="px-0" style={{width: '34%', fontSize: '14px',}}>Register</div>
        </button>  

        </div>
      </form>

      <div className="form-footer d-flex justify-content-between align-items-center px-4">
        <div style={{fontSize: '16px'}}>Already Registered ?</div>
        {/* <button type="button" className="btn btn-info border border-info">Sign Up</button> */}
        <button type="button" id="form-footer-btn" className="btn btn-info border border-dark btn-sm" onClick={() => window.location='/login'}>
          Log In
        </button>
        
        {/* data-mdb-target="#signup-modal" data-mdb-toggle="modal" */}
        {/* data-toggle="modal" data-target="#signup-modal" */}
      </div>
    
    </div>
  </div>
  )
}


export default Register