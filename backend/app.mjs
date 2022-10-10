import { express, mongoose, PORT, IP, CONNECTION_STRING} from './vars.mjs'
import { User} from './user-schema.mjs'
import { userDecoderMiddleware, authenticationMiddleware, errorHandler, corsHandler } from './middlewares.mjs'
import cors from 'cors'
import {StatusCodes as sc} from 'http-status-codes'
import registerController from './auth/register.js'
import loginController from './auth/login.js'
import logoutController from './auth/logout.js'
import refreshTokenController from './auth/refresh_token.js'
import uploadHandler from './upload.js'
import formidable from 'express-formidable'

const app = express()
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(express.static('./public'))
// app.use(cors())
app.use(corsHandler)


app.get('/', (req, res) => {
  return res.status(200).send('Aman-Rohilla@rohilla.co.in')
})

// register a user with first-name, last-name, email and password
app.post('/api/register', registerController)

// authenticate|login user and return access token and refresh token
app.post('/api/login', loginController)

app.get('/api/logout', logoutController)


// return a access token to user by authenticating with refresh token
app.get('/api/refresh', refreshTokenController)


// decode the user and assign user id to request object
app.use(userDecoderMiddleware)

app.use('/api/sketch', formidable());
app.post('/api/sketch', authenticationMiddleware, uploadHandler)


import {getASketch, getAllSketches, updateASketch} from './rest-controller.js'
app.get('/api/sketch', authenticationMiddleware, getAllSketches)
app.get('/api/sketch/:id', getASketch)
app.patch('/api/sketch/:id', authenticationMiddleware, updateASketch)



app.use(errorHandler)

try {
  await mongoose.connect(CONNECTION_STRING)
  console.log('CONNECTED to database...')
  app.listen(PORT, IP, console.log(`Server listening on ${IP}:${PORT} ...`))
} catch (err) {
  console.log(`FAILED to connect to database...\nerror : ${err}`)    
}

