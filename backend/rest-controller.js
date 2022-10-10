import path from 'path'
import { Sketch } from './sketch-schema.js'
import {sc} from './vars.mjs'
import base64Img from 'base64-img'

const getASketch = async (req, res) => {
  return res.status(200).sendFile(path.resolve('./sketches', req.params.id+'.png'))
}

const getAllSketches = async (req, res) => {
  let sketches = await Sketch.find({}, {_id: 1, sketchUserID: 1, sketchUserName: 1, title: 1, members: 1})
  
  sketches = sketches.map(sketch => 
    ({sketchID: sketch._id, title: sketch.title, sketchUserName: sketch.sketchUserName, sketchUserID: sketch.sketchUserID, members: sketch.members })
  )

  return res.status(200).json({success: true, sketches})
}

const updateASketch = async (req, res) => {

  let sketch = await Sketch.findById({_id: req.params.id}, {_id: 1, sketchUserID: 1, sketchUserName: 1, title: 1, members: 1})
  if(!sketch) {
    return res.status(sc.BAD_REQUEST).json({success: false, message: `No sketch found with id = ${req.params.id}`})
  }

  if(req.userID != sketch.sketchUserID) {
    if(!sketch.members.find(member => member.memberID == req.userID))
      sketch = await Sketch.findByIdAndUpdate({_id: req.params.id}, {$addToSet: {members: {memberID: req.userID, memberName: req.userName}}}, {new: true})
  }

  const data = req.fields.image;
  base64Img.img(data, 'sketches', req.params.id, async (err, filepath) => {
    const jsRes = {success: err ? false : true}
    if(!err) {
      const sketchRes = {sketchID: sketch._id, title: sketch.title, sketchUserID: sketch.sketchUserID, sketchUserName: sketch.sketchUserName, members: sketch.members }
      jsRes.sketch = sketchRes
    }
    res.status(err ? sc.INTERNAL_SERVER_ERROR : sc.OK).json(jsRes)
  });


}



export {getASketch, getAllSketches, updateASketch}