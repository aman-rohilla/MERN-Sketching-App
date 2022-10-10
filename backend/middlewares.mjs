import { jwt, JWT_SECRET, sc} from './vars.mjs' 

const userDecoderMiddleware = (req, res, next) => {
  let userToken = req.cookies && req.cookies.token || req.headers.authorization 
  if(userToken && req.headers.authorization.startsWith('Bearer ')) {
    userToken = req.headers.authorization.split(' ')[1]
  }
  if(!userToken) return next()

  try {
    const decodedPayload = jwt.verify(userToken, JWT_SECRET) 
    if(! decodedPayload.refreshToken)
      req.userID = decodedPayload.userID
      req.userName = decodedPayload.userName
    next()    
  } catch(error) {
    next()
  }
}

const authenticationMiddleware = (req, res, next) => {
  if(!req.userID) {
    return res.status(sc.UNAUTHORIZED).json({success: false, message: "Unauthorized"})
  }
  next()
}

const errorHandler = (error, req, res, next) => {
  let errors = [];
  if (error.name === "ValidationError") {
    Object.keys(error.errors).forEach((key) => {
      errors.push(error.errors[key].message)
    });
  }
  // let message = 'Something went wrong'
  let message = error.message
  let status = sc.INTERNAL_SERVER_ERROR
  
  if(errors.length) {
    status = sc.BAD_REQUEST
    if(errors.length == 1) {
      message = errors[0]
    } else {
      message = errors
    }
  }
  return res.status(status).json({success: false, message})
}


const ORIGIN = process.env.ORIGIN
const corsHandler = (req, res, next) => {
  if(!ORIGIN || req.headers.origin != ORIGIN)
    return next()
  
  res.header('Access-Control-Allow-Origin', ORIGIN);
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE, HEAD');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header('Access-Control-Allow-Credentials', true);
  next();
}

const oneDay = 1000 * 60 * 60 * 24
const setCookie = (req, res, cookie, value, httpOnly=true) => {
  res.cookie(cookie, value, {
    httpOnly,
    expires: new Date(Date.now() + oneDay * 7),
    secure: true,
    sameSite: req.headers.origin == ORIGIN ? 'lax' :'none',
    path: '/'
  });
}

export { userDecoderMiddleware, authenticationMiddleware, errorHandler, corsHandler, setCookie }
