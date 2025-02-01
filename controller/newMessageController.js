const fs = require('fs');
const { format } = require('date-fns');
const expressAsyncHandler = require('express-async-handler');

let messages = [];
const readMessages = async () => {
    try {
        await fs.promises.access('messages.json');
        const data = await fs.promises.readFile('messages.json', 'utf-8');
        messages = JSON.parse(data);
        return messages;
    } catch (error) {
        // If the file doesn't exist or any other error, create it with an empty array
        if (error.code === 'ENOENT') {
            await fs.promises.writeFile('messages.json', JSON.stringify([]));
        }
        return [];  // Return an empty array as initial data

    }
}

const handleNewMessage = expressAsyncHandler(async (req, res) => {
    const { messageText, messageUser } = req.body;

    if (!messageText || !messageUser) {
        return res.status(400).json({ error: 'Message text and user are required' });
    }

    const messages = await readMessages();
    const newMessage = {
        id: messages.length + 1,
        text: messageText,
        user: messageUser,
        date: new Date().toISOString()
    };
    messages.push(newMessage);

    try {
        await fs.promises.writeFile('messages.json', JSON.stringify(messages, null, 2));  // Pretty-printing the JSON
        res.redirect('/');
    } catch (error) {
        console.error('Error writing to file:', error);
        res.status(500).json({ error: 'Unable to save the message' });
    }
});

const handleOpenMessage = expressAsyncHandler(async (req, res) => {
    const messageId = parseInt(req.params.id);
    const messages = await readMessages();
    const message = messages[messageId];

    if (message) {
        const timeZone = req.query.timeZone || 'UTC';
        const formattedDate = convertToTimezone(message.date, timeZone);
        res.render('details', { message: { ...message, date: formattedDate } });
    } else {
        res.status(404).send('Message not found');
    }
});


const renderIndex = async (req, res) => {
    const messages = await readMessages();
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

module.exports = {
    renderIndex,
    renderForm,
    handleNewMessage,
    handleOpenMessage
}