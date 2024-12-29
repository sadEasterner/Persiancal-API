import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
    host: 'smtp.example.com', // SMTP server hostname
    port: 587, // SMTP port (usually 587 for TLS or 465 for SSL)
    secure: false, // true for 465, false for other ports
    auth: {
        user: 'your_email@example.com', // Your email address
        pass: 'your_password' // Your email password or application-specific password
    }
});