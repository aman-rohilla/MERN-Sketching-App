import axios from 'axios';

const baseURL = 'http://localhost'

axios.defaults.withCredentials = true
axios.defaults.headers.common['Authorization'] = localStorage.getItem('token');
axios.defaults.baseURL = baseURL

window.dom = {}

export {axios, baseURL}