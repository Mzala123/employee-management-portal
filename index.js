var Express = require('express')
var bodyParser = require('body-parser')
const { request, response } = require('express')

var app = Express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

var MongoClient = require("mongodb").MongoClient
var CONNECTION_STRING = "mongodb+srv://Mzala:bounce123@mzalacluster.qqifv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

var fileUpload = require('express-fileupload')
var fs = require ('fs')
app.use(fileUpload())
app.use('/Photos', Express.static(__dirname+'/Photos'))

var cors = require('cors')
app.use(cors)

var DATABASE = "testdb"
var database

app.listen(3000, ()=>{

    MongoClient.connect(CONNECTION_STRING, {useNewUrlParser:true}, (error, client)=>{
      database = client.db(DATABASE)
      console.log("mongodb connection successful")
    })

})

app.get('/', (request, response) =>{
    response.send('Hello world')
})

app.get('/api/department', (request, response) => {
    database.collection('Department').find({}).toArray((error, result) =>{
        if(error){
          console.log(error)
        }else{
            console.log(result);
            response.json(result);
        }
    })
})

app.post('/api/department', (request, response) =>{
     database.collection('Department').count({}, function(error, numOfDocs){
         if(error){
             console.log(error)
         }else{
             database.collection('Department').insertOne({
                 DepartmentId : numOfDocs+1,
                 DepartmentName : request.body['DepartmentName']
             })
             response.json("Added successfully");
         }
       
     })
})


app.put('/api/department', (request, response) =>{
     database.collection('Department').updateOne(
         //Filter criteria
          {
              "DepartmentId":request.body['DepartmentId']
          },
         //update criteria
          {$set:
            {
               "DepartmentName":request.body['DepartmentName']
            }
          }
     );
     response.json("updated Successfully")
})


app.delete('/api/department/:id', (request, response) =>{
    database.collection('Department').deleteOne(
        {
            DepartmentId: parseInt(request.params.id)
        }
    );
    response.json("deleted Successfully")
})


// employee APIs 

app.get('/api/employee', (request, response) => {
    database.collection('Employee').find({}).toArray((error, result) =>{
        if(error){
          console.log(error)
        }else{
            console.log(result);
            response.json(result);
        }
    })
})

app.post('/api/employee', (request, response) =>{
     database.collection('Employee').count({}, function(error, numOfDocs){
         if(error){
             console.log(error)
         }else{
             database.collection('Employee').insertOne({
                 EmployeeId : numOfDocs+1,
                 EmployeeName : request.body['EmployeeName'],
                 Department:  request.body['Department'],
                 DateOfJoining:  request.body['DateOfJoining'],
                 PhotoFileName:  request.body['PhotoFileName']
             })
             response.json("Added successfully");
         }
       
     })
})


app.put('/api/employee', (request, response) =>{
     database.collection('Employee').updateOne(
         //Filter criteria
          {
              "EmployeeId":request.body['EmployeeId']
          },
         //update criteria
          {$set:
            {
               "EmployeeName":request.body['EmployeeName'],
               "Department":request.body['Department'],
               "DateOfJoining":request.body['DateOfJoining'],
               "PhotoFileName":request.body['PhotoFileName'],

            }
          }
     );
     response.json("updated Successfully")
})


app.delete('/api/employee/:id', (request, response) =>{
    database.collection('Employee').deleteOne(
        {
            EmployeeId: parseInt(request.params.id)
        }
    );
    response.json("Employee deleted Successfully")
})


app.post('/api/employee/savefile', (req, res) =>{
     fs.writeFile('./Photos/'+req.files.file.name,
     req.files.file.data, function(error){
        if(error){
            console.log(error)
        }else{
            res.json(req.files.file.name)
        }
      }
     )
} )