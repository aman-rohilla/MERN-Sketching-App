import axios from 'axios'
import React, { useState, useEffect } from 'react'
import './login-register.css'
import loginHelper from './login-helper'
import { alertMessage } from '../utils'

const Login = () => {
  if(window.getUsername()) window.location = '/'


  const [spin, setSpin] = useState(false)
  const [alerts, setAlerts] = useState([])

  const spinnerClass = "float-end spinner spinner-border spinner-border-sm"

  const loginHandler = (event) => {
    loginHelper({event, setSpin, setAlerts})
  }

  return (
  <div id="login-form-div" className="mx-auto">
    <div className="form-main">
        
      <div className='form-header'>Login to your account</div>

      
      <form onSubmit={loginHandler}>
        <div id="form-alerts">{alerts.length ? alertMessage(alerts, setAlerts): <></>}</div>

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
          <div className="clearfix spinner-div" style={{width: '33%'}}>
            <span className="d-none float-end spinner spinner-border spinner-border-sm" role="status" aria-hidden="true" style={{height: '20px', width: '20px'}}></span>
          </div>
          <div className="px-0" style={{width: '34%', fontSize: '14px'}}>Log In</div>
        </button>  

        </div>
      </form>

      <div className="form-footer d-flex justify-content-between align-items-center px-4">
        <div style={{fontSize: '16px'}}>Don't have an account ?</div>
        {/* <button type="button" className="btn btn-info border border-info">Sign Up</button> */}
        <button type="button" id="form-footer-btn" className="btn btn-info border border-dark btn-sm" onClick={() => window.location='/register'}>
          Sign Up
        </button>
        
        {/* data-mdb-target="#signup-modal" data-mdb-toggle="modal" */}
        {/* data-toggle="modal" data-target="#signup-modal" */}
      </div>
    
    </div>
  </div>
  )



}


export default Login