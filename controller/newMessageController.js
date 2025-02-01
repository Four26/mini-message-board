const express = require('express');
const fs = require('fs');
const { format } = require('date-fns');

if (!fs.existsSync('messages.json')) {
    fs.writeFileSync('messages.json', JSON.stringify([]));
}

let messages = [];
if (fs.existsSync('messages.json')) {
    const data = fs.readFileSync('messages.json', 'utf-8');
    messages = JSON.parse(data);
}

const renderIndex = (req, res) => {
    res.render('index', { title: 'Mini Messageboard', messages: messages });
}

const renderForm = (req, res) => {
    res.render('form');
}

const convertToTimezone = (isoString, timeZone = 'UTC') => {
    try {
        const date = new Date(isoString);

        return format(date, 'yyyy-MM-dd HH:mm:ss');

    } catch (error) {
        console.error('Date conversion error:', error);
        return isoString; // Return original string if conversion fails
    }
}

const handleNewMessage = (req, res) => {
    const newMessage = {
        id: messages.length + 1,
        text: req.body.messageText,
        user: req.body.messageUser,
        date: new Date().toISOString()
    };
    messages.push(newMessage);
    fs.writeFileSync('messages.json', JSON.stringify(messages));
    res.redirect('/');
}

const handleOpenMessage = (req, res) => {
    const messageId = parseInt(req.params.id);
    const message = messages[messageId];

    if (message) {
        const timeZone = req.query.timeZone || 'UTC';
        try {
            const formattedDate = convertToTimezone(message.date, timeZone);
            res.render('details', { message: { ...message, date: formattedDate } });
        } catch (error) {
            console.error('Error formatting date:', error);
            res.render('details', { message }); // Fallback to original message
        }

    }

}

module.exports = {
    renderIndex,
    renderForm,
    handleNewMessage,
    handleOpenMessage
}