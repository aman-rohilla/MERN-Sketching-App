import { mongoose, jwt, JWT_SECRET } from './vars.mjs'

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, `First name can't be empty`],
    minlength: [2, 'First name too short'],
    maxlength: [50, 'First name too big'],
    trim: true,
  }, 
  lastName: {
    type: String,
    required: [true, `Last name can't be empty`],
    minlength: [2, 'Last name too short'],
    maxlength: [50, 'Last name too big'],
    trim: true,
  }, 
  email: {
    type: String,
    required: [true, `Email can't be empty`],
    minlength: [6, 'Email too short'],
    maxlength: [60, 'Name too big'],
    trim: true,
    match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, `Email format is invalid`],
    unique: true
  },
  password: {
    type: String,
    trim: true,
    required: [true, `Password can't be empty`],
    minlength: [8, 'Password is less than 8 characters'],
  },
},
{ 
  timestamps: true
})


UserSchema.methods.genAccessToken = function() {
  return jwt.sign({userID: this._id, userName: this.firstName}, JWT_SECRET, {expiresIn: '7d'})
}

UserSchema.methods.genRefreshToken = function() {
  return jwt.sign({userID: this._id, userName: this.firstName, refreshToken: true}, JWT_SECRET, {expiresIn: '14d'})
}

const User = mongoose.model('User', UserSchema)
export {User}
