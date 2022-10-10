import { mongoose } from './vars.mjs'

const SketchSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, `Sketch title can't be empty`],
    minlength: [2, 'Sketch title too short'],
    maxlength: [50, 'Sketch title too big'],
    trim: true,
  },
  sketchUserName: {
    type: String,
    required: true
  },
  sketchUserID: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    memberID : {
      type: String,
      required: true
      // ref:'User',  
    },
    memberName: {
      type: String,
      required: true
    }
  }],
},
{ 
  timestamps: true
})

const Sketch = mongoose.model('Sketch', SketchSchema)

export {Sketch}