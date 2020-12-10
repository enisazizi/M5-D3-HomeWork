const express = require("express") // third party module
const fs = require("fs") // core module
const path = require("path") // core module
const uniqid = require("uniqid") // third party module
const {check ,validationResult} = require("express-validator")
const { studentProjects } = require("../projects/utils");
const router = express.Router()

const readFile = fileName =>{

    const buffer = fs.readFileSync(path.join(__dirname,fileName))
    const fileContent = buffer.toString()
    return JSON.parse(fileContent)
}


router.get("/", (req, res, next) => {
  try {
    const studentsDB = readFile("students.json")
    if (req.query && req.query.name) {
      const filteredStudents = studentsDB.filter(
        student =>
          student.hasOwnProperty("name") &&
          student.name.toLowerCase() === req.query.name.toLowerCase()
      )
      res.send(filteredStudents)
    } else {
      res.send(studentsDB)
    }
  } catch (error) {
    next(error)
  }
})

router.get("/:id", (req, res, next) => {
    try {
      const studentsDB = readFile("students.json")
      const user = studentsDB.filter(user => user.ID === req.params.id)
      if (user.length > 0) {
        res.send(user)
      } else {
        const err = new Error()
        err.httpStatusCode = 404
        next(err)
      }
    } catch (error) {
      next(error)
    }
  })
  

router.post("/",(req,res,next)=>{
    
    const studentsFilePath = path.join(__dirname, "students.json")
    const fileAsABuffer = fs.readFileSync(studentsFilePath)
    const fileAsAString = fileAsABuffer.toString()
    const studentsArray = JSON.parse(fileAsAString)

    

    const newStudent = req.body
  newStudent.ID = uniqid()
  newStudent.CountProjects = 0
    let count=0;
    
    studentsArray.map((student)=>{
        if(student.Email ===newStudent.Email){
            count=2;
        }

  })

    if(count===0){
        studentsArray.push(newStudent)
  
        fs.writeFileSync(studentsFilePath, JSON.stringify(studentsArray))
      
        res.status(201).send({ id: newStudent.ID })
      
     

    }else{
        res.send("Email are the same")
    }
})
  
 

router.put("/:id", (req, res) => {
    
    const studentsFilePath = path.join(__dirname, "students.json")
    const fileAsABuffer = fs.readFileSync(studentsFilePath)
    const fileAsAString = fileAsABuffer.toString()
    const studentsArray = JSON.parse(fileAsAString)

    const newStudentsArray = studentsArray.filter(student => student.ID !== req.params.id)

        const modifiedStudent = req.body
        modifiedStudent.ID = req.params.id

        newStudentsArray.push(modifiedStudent)

        fs.writeFileSync(studentsFilePath,JSON.stringify(newStudentsArray))
        res.send("Edited ")

})  

router.delete("/:id", (req, res) => {
    
    const studentsFilePath = path.join(__dirname, "students.json")
    const fileAsABuffer = fs.readFileSync(studentsFilePath)
    const fileAsAString = fileAsABuffer.toString()
    const studentsArray = JSON.parse(fileAsAString)
  

    const newStudentsArray = studentsArray.filter(student => student.ID !== req.params.id)
  
   
  
    fs.writeFileSync(studentsFilePath, JSON.stringify(newStudentsArray))
  
    res.status(204).send()
  })
  router.get("/:id/projects", (req, res) => {
    const projects = studentProjects(req.params.id);
    if (!projects) {
      res.status(400).send("ID does not exist");
    } else {
      res.status(200).send(projects);
    }
  });
  
  module.exports = router