'use strict';
const nodemailer = require('nodemailer');
import config from '../../config';

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.mailingEmailAddress,
        pass: config.mailingEmailPassword
    }
});

module.exports = transporter;