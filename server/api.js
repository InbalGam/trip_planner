const express = require('express');
const apiRouter = express.Router();
const { getAllFromDatabase, getFromDatabaseById, addToDatabase, deleteFromDatabasebyId, createMeeting, deleteAllFromDatabase, updateInstanceInDatabase, getWorkFromDatabaseById, createWork } = require('./db');
const checkMillionDollarIdea = require('./checkMillionDollarIdea');