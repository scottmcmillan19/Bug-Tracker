import express from 'express';
import Task from '../models/Task';
import User from '../models/User';
const auth = require('../middleware/auth');
const router = express.Router();
router.use(express.urlencoded({ extended: false }));
router.use(express.json());
import jwtDecode from 'jwt-decode';

// get all tasks
router.get('/', auth, (req, res) => {
    Task.find({}, (err, docs) => {
      res.send(docs)
    })
  });

  // get my created tasks
  router.get('/myCreatedTasks', auth, (req, res) => {
    let token = req.header("x-auth-token");
    let decoded = jwtDecode(token);
    Task.find({reporterId: decoded.id}, (err, docs) => {
      res.send(docs);
    })
  })

  // get my assigned tasks
  router.get('/myAssignedTasks', auth, (req, res) => {
    let token = req.header("x-auth-token");
    let decoded = jwtDecode(token);
    Task.find({assignedToId: decoded.id}, (err, docs) => {
      res.send(docs);
    })
  })

  // get specific task
  router.get('/:taskId', auth, (req, res) => {
    Task.findById(`${req.params.taskId}`, (err, doc) => {
      res.send(doc)
    })
  });

  // create a new task
  router.post('/', auth, (req, res) => {
    let token = req.header("x-auth-token");
    let decoded = jwtDecode(token);
    User.findOne({name: req.body.assignedTo}, (err, doc) => {
      var newTask = new Task({
        title: req.body.title,
        description: req.body.description,
        assignedToId: doc._id,
        priority: req.body.priority,
        reporterId: decoded.id,
        status: req.body.status,
        dateCreated: req.body.dateCreated,
      }) 
      newTask.save()
    })
  })

  // change status when starting new task
  router.post('/changeTaskStatus/:taskId', auth, (req, res) => {
    Task.findByIdAndUpdate(`${req.params.taskId}`, {status: "In Progress"}, (err, doc) => {
      res.send(doc)
    })
  })

  // delete task
  router.post('/delete/:taskId', auth, (req, res) => {
    Task.findByIdAndDelete(`${req.params.taskId}`, (err, doc) => {
      res.send(doc);
    })
  })

  // edit task
  router.post('/editTask/:taskId', auth, (req, res) => {
    Task.findByIdAndUpdate(`${req.params.taskId}`, {title: req.body.title, description: req.body.description,
    assignedToId: req.body.assignedToId, priority: req.body.priority, reporterId: req.body.reporterId, status: req.body.status, dateCreated: req.body.dateCreated, dateModified: Date.now()}, (err, doc) => {
     res.send(doc);
    })
  })

  // complete task
  router.post('/finishTask/:taskId', auth, (req, res) => {
    Task.findByIdAndUpdate(`${req.params.taskId}`, {status: "Closed"}, (err, doc) => {
      res.send(doc)
    })
  })

  // edit task not on edit menu
  router.post('/editInPlace/:taskId', auth, (req, res) => {
    console.log(req.body)
    var time = Date.now();
    var status1 = req.body.task.status;
    var priority1 = req.body.task.priority;
    var description1 = req.body.task.description;
    var assignedToId1 = req.body.task.assignedToId;
    if (req.body.newStatus) {
      status1 = req.body.newStatus;
    }
    if (req.body.newPriority) {
      priority1 = req.body.newPriority;
    }
    if (req.body.newDescription) {
      description1 = req.body.newDescription;
    }
    if (req.body.newAssignedToId) {
      assignedToId1 = req.body.newAssignedToId;
    }
    Task.findByIdAndUpdate(`${req.params.taskId}`, {title: req.body.task.title, description: description1,
    assignedToId: assignedToId1, priority: priority1, reporterId: req.body.task.reporterId, status: status1, 
    dateCreated: req.body.task.dateCreated, dateModified: time}, (err, doc) => {
      res.send(doc)
    })
  })
  

  export default router;