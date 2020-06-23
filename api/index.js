import { MongoClient, ObjectID } from 'mongodb';
import express from 'express';
import assert from 'assert';
import bodyParser from 'body-parser';
import Bug from '../models/Bug';
import User from '../models/User';
const auth = require('../middleware/auth');
const router = express.Router();
router.use(express.urlencoded({ extended: false }));
router.use(express.json());
import jwtDecode from 'jwt-decode';

// getting data from db and displaying bugs on localhost:8080/api/bugs
router.get('/bugs', auth, (req, res) => {
  Bug.find({}, (err, docs) => {
    res.send(docs)
  })
});

router.get('/myCreatedBugs', auth, (req, res) => {
  let token = req.header("x-auth-token");
  let decoded = jwtDecode(token);
  Bug.find({reporterId: decoded.id}, (err, docs) => {
    res.send(docs);
  })
})

router.get('/myAssignedBugs', auth, (req, res) => {
  let token = req.header("x-auth-token");
  let decoded = jwtDecode(token);
  Bug.find({assignedToId: decoded.id}, (err, docs) => {
    res.send(docs);
  })
})

//get a specific bug from db
router.get('/bugs/:bugId', auth, (req, res) => {
  Bug.findById(`${req.params.bugId}`, (err, doc) => {
    res.send(doc)
  })
});

router.post('/bugs', auth, (req, res) => {
  let token = req.header("x-auth-token");
  let decoded = jwtDecode(token);
  User.findOne({name: req.body.assignedTo}, (err, doc) => {
    var newBug = new Bug({
      title: req.body.title,
      description: req.body.description,
      assignedToId: doc._id,
      priority: req.body.priority,
      reporterId: decoded.id,
      status: req.body.status,
      dateCreated: req.body.dateCreated,
      reproduce: req.body.reproduce
    }) 
    newBug.save()
  })
})

router.post('/bugs/updateBug/:bugId', auth, (req, res) => {
  Bug.findByIdAndUpdate(`${req.params.bugId}`, {status: "In Progress"}, (err, doc) => {
    res.send(doc)
  })
})

router.post('/bugs/finishBug/:bugId', auth, (req, res) => {
  Bug.findByIdAndUpdate(`${req.params.bugId}`, {status: "Closed"}, (err, doc) => {
    res.send(doc)
  })
})


router.post('/bugs/delete/:bugId', auth, (req, res) => {
  Bug.findByIdAndDelete(`${req.params.bugId}`, (err, doc) => {
    res.send(doc);
  })
})

router.post('/bugs/editBug/:bugId', auth, (req, res) => {
  var time = Date.now();
  Bug.findByIdAndUpdate(`${req.params.bugId}`, {title: req.body.title, description: req.body.description,
  assignedToId: req.body.assignedToId, priority: req.body.priority, reporterId: req.body.reporterId, status: req.body.status, dateCreated: req.body.dateCreated, dateModified: time, reproduce: req.body.reproduce}, (err, doc) => {
    res.send(doc)
  })
})

router.post('/bugs/editInPlace/:bugId', auth, (req, res) => {
  var time = Date.now();
  var status1 = req.body.bug.status;
  var priority1 = req.body.bug.priority;
  var reproduce1 = req.body.bug.reproduce;
  var description1 = req.body.bug.description;
  var assignedToId1 = req.body.bug.assignedToId;
  if (req.body.newStatus) {
    status1 = req.body.newStatus
  }
  if (req.body.newPriority) {
    priority1 = req.body.newPriority;
  }
  if (req.body.newReproduce) {
    reproduce1 = req.body.newReproduce;
  }

  if (req.body.newDescription) {
    description1 = req.body.newDescription;
  }
  if (req.body.newAssignedToId) {
    assignedToId1 = req.body.newAssignedToId;
    console.log(assignedToId1)
  }
  
  Bug.findByIdAndUpdate(`${req.params.bugId}`, {title: req.body.bug.title, description: description1,
    assignedToId: assignedToId1, priority: priority1, reporterId: req.body.bug.reporterId, status: status1, 
    dateCreated: req.body.bug.dateCreated, dateModified: time, reproduce: reproduce1}, (err, doc) => {
      res.send(doc);
    })
})




export default router;