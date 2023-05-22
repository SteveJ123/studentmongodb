const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Student = require('./model');
const dbConfig = require('./config');
const { MongoClient, ObjectId } = require('mongodb');

var PORT = 3000;
var app = express();

app.set("view engine","ejs");   // for viewing
app.use(bodyParser.urlencoded({extended: true}));   // used for parsing url encoded bodies
app.use(bodyParser.json());     // used for parsing json data

mongoose.connect(dbConfig.url,{
    useNewUrlParser: true
}).then(()=>{
    console.log("Connected to the database");
}).catch((err)=>{
    console.log("Cannot connect to the database. Possible error => ",err);
    process.exit();
});

// form
app.get('/',(req,res)=>{
    res.render("index");
});

// add student
app.post('/addStudent',(req,res)=>{   
    var stud = new Student(req.body);
    stud.save().then(()=>res.render("viewstudents")).catch((err)=>{
        res.status(400).json({"error": err});
    });
});

// get all students and count
app.get('/students',(req,res)=>{
    var query = {};
    console.log("req", req.query)
    
    if(Object.keys(req.query).length != 0){
        var li = req.query['subject'].split(',').map(sub=>sub+"_Marks");
        var marks = parseInt(req.query['marks']);
        for(let i=0;i<li.length;i++){
            query[li[i]] = {$gt: marks};
        }
    }
    
    Student.find(query).count().then((c)=>{
        Student.find(query).then((student)=>{
            res.render("table",{student:student, count:c});
        })
    }).catch((err)=>res.json({"error":err}));
});

// delete any student
app.post('/deleteStudent/:id',(req,res)=>{
    Student.findByIdAndDelete(req.params.id).then((student)=>{
        res.redirect('/students');
    }).catch((err)=>{
        res.json({"error": err});
    })
});

app.get('/students/:id', (req, res)=>{
    Student.findById(req.params.id).then((student)=>{
        console.log("student", student)
        res.json(student)
    }).catch((err)=>{
        res.json({"error": err})
    })
})

// update any student
app.post('/updateStudent',(req,res)=>{
    console.log("body", req.body)
    // console.log("req", new ObjectId(req.body._id))
    var id = new ObjectId(req.body._id);
    var data = {       
        Name: req.body.Name,
    Roll_No: req.body.Roll_No,
    WAD_Marks: Number(req.body.WAD_Marks),
    CC_Marks: Number(req.body.CC_Marks),
    DSBDA_Marks: Number(req.body.DSBDA_Marks),
    CNS_Marks: Number(req.body.CNS_Marks),
    AI_Marks: Number(req.body.AI_Marks),
    }
    console.log(data);
    var marks = parseInt(req.query['marks']);
    Student.findByIdAndUpdate(req.body.mongoid, data, {new: true}).then(()=>{
        res.redirect('/students');
    }).catch((err)=>{
        res.json({"error": err});
    });
});

app.listen(PORT,()=>{
    console.log("Listening");
})