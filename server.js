import config from 'config';
import apiRouter from './api/index';
import taskRouter from './api/task';
import sassMiddleware from 'node-sass-middleware';
import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
//import CreateNewBug from './src/components/CreateNewBug';
import React from 'react';
import { reset } from 'nodemon';
import createNewBugRender from './createNewBugRender';
import userRouter from './api/users';
import authRouter from './api/auth';
import mongoose from 'mongoose';
const env = process.env;
// starting the server
const server = express();

server.use(express.json());
server.use(express.urlencoded({extended: false}));

server.use(sassMiddleware({
  src: path.join(__dirname, 'sass'),
  dest: path.join(__dirname, 'public')
}));

server.set('view engine', 'ejs');

// request to the home page or a specific bug page
server.get(['/', '/bug/:bugId', '/createNewData', '/bugs', '/register', '/login', '/bugs/myCreatedBugs', '/bugs/myAssignedBugs',
'/bug/edit/:bugId', '/bugs/edit/deleted', '/bugs/edit/updated', '/tasks', '/task/:taskId', '/tasks/myAssignedTasks', '/tasks/myCreatedTasks', '/createNewData/created', '/tasks/finished'
, '/bugs/finished', '/tasks/edit/updated', '/tasks/edit/updated', '/task/edit/:taskId'], (req, res) => {
   res.render('index');
});
const db = config.get('mongodbUri');
mongoose.connect(process.env.MONGODB_URI || db, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false});

server.use('/api', apiRouter);
server.use('/api/users', userRouter);
server.use('/api/auth', authRouter);
server.use(express.static('public'));
server.use('/api/tasks', taskRouter);



const port = env.PORT || 8080;
const host = env.HOST || '0.0.0.0';
server.listen(port, host, () => {
  console.info('Express listening on port', port);
});

