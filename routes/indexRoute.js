const express = require('express');
const router = express.Router();
const { renderIndex, renderForm, handleNewMessage, handleOpenMessage } = require('../controller/newMessageController');

//render index.ejs
router.get('/', renderIndex);

//render form.ejs
router.get('/new', renderForm);

//handle adding new messages
router.post('/', handleNewMessage);

//handle in opening messages
router.get('/details/:id', handleOpenMessage);

module.exports = router;