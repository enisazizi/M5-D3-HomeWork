const express = require("express")
const fs = require("fs")
const path = require("path")
const uniqid = require("uniqid")
const { check, validationResult } = require("express-validator")
const { findByID, addPropertyNoProject } = require("./utils");


const router = express.Router()

const readFile = fileName =>{
    const buffer = fs.readFileSync(path.join(__dirname, fileName))
    const fileContent = buffer.toString()
    console.log(path.join(__dirname,`projects.json`))
    return JSON.parse(fileContent)

}




router.get("/:id", (req, res, next) => {
    try {
      const projectsDB = readFile("projects.json")
      const project = projectsDB.filter(project => project.ID === req.params.id)
      if (project.length > 0) {
        res.send(project)
      } else {
        const err = new Error()
        err.httpStatusCode = 404
        next(err)
      }
    } catch (error) {
      next(error)
    }
  })
  
  router.get("/",(req, res, next) => {
    try {
        const errors = validationResult(req)
        if(!errors.isEmpty()){

            const err = new Error()
            err.message = errors
            err.httpStatusCode = 400
            next(err)

        }else{
            const projectsDB = readFile("projects.json")
    
            res.send(projectsDB)
        }

        
      
     
    } catch (error) {
      next(error)
    }
  })
  
  router.post( "/",[check("Name").isLength({min:5}).withMessage("Name must be longer than 5 characters").exists()
  .withMessage("Insert a name please!"),check("Description").isLength({min:5}).withMessage("write a longer Description").exists().withMessage("write a Description please"),check("RepoUrl").exists().withMessage("add your project")],
    (req, res, next) => {
      try {
        const errors = validationResult(req)
  
        if (!errors.isEmpty()) {
          const err = new Error()
          err.message = errors
          err.httpStatusCode = 400
          next(err)
        } else {
          addPropertyNoProject(req.body.studentID);
          const projectsDB = readFile("projects.json")
          const newProject = {
            ...req.body,
            ID: uniqid(),
            modifiedAt: new Date(),
          }
        
         
  
          projectsDB.push(newProject)
  
          fs.writeFileSync(
            path.join(__dirname, "projects.json"),
            JSON.stringify(projectsDB)
          )
  
          res.status(201).send({ id: newProject.ID })


    
    const studentsFilePath = path.join(__dirname, "./students.json")
    const fileAsABuffer = fs.readFileSync(studentsFilePath)
    const fileAsAString = fileAsABuffer.toString()
    const studentsArray = JSON.parse(fileAsAString)

    const newStudentsArray = studentsArray.filter(student => student.ID !== "bp0idw7x4kihnzak7")

        const modifiedStudent = req.body
        
        modifiedStudent.ProCount += 1
        modifiedStudent.ID ="bp0idw7x4kihnzak7"

        newStudentsArray.push(modifiedStudent)

        fs.writeFileSync(studentsFilePath,JSON.stringify(newStudentsArray))
      



        }
      } catch (error) {
        next(error)
      }
    }
  )
  
  router.delete("/:id", (req, res, next) => {
    try {
      const projectsDB = readFile("projects.json")
      const newProject = projectsDB.filter(project => project.ID !== req.params.id)
      fs.writeFileSync(path.join(__dirname, "projects.json"), JSON.stringify(newProject))
  
      res.status(204).send()
    } catch (error) {
      next(error)
    }
  })
  
  router.put("/:id", [check("Name").exists().withMessage("Insert a name please!").isLength({min:5}).withMessage("Name must be longer than 5 characters")
  ,check("Description").isLength({min:5}).withMessage("write a longer Description").exists().withMessage("write a Description please"),check("RepoUrl").exists().withMessage("add your project")],
  (req, res, next) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            const err = new Error()
            err.message = errors
            err.httpStatusCode = 400
            next(err)
          }else{
            const projectsDB = readFile("projects.json")
            const newProject = projectsDB.filter(project => project.ID !== req.params.id)
        
            const modifiedProject = {
              ...req.body,
              ID: req.params.id,
              modifiedAt: new Date(),
            }
            newProject.push(modifiedProject)
            fs.writeFileSync(path.join(__dirname, "projects.json"), JSON.stringify(newProject))
        
            res.send({ id: modifiedProject.ID })

          }
     
  
     
    } catch (error) {
      next(error)
    }
  })
  
  module.exports = router
  