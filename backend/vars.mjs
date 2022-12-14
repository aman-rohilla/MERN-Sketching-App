import express from 'express'
import {config} from 'dotenv'
config()
import 'express-async-errors'
import mongoose from 'mongoose'

import jwt from 'jsonwebtoken'
import bcrpyt from 'bcryptjs'
import {StatusCodes as sc} from 'http-status-codes'


const PORT = process.env.PORT || 80
const IP   = process.env.IP || '127.0.0.1'


const JWT_SECRET     = process.env.JWT_SECRET     || 'wgtjwkoovgwrjzbgtodmgnsdnjdmhdhd'
const CONNECTION_STRING = process.env.MONGODB_CONNECTION_STRING || 'mongodb://localhost/sketching'

export {express, mongoose, jwt, bcrpyt, PORT, JWT_SECRET, CONNECTION_STRING, IP, sc}
