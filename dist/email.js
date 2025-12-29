import nodemailer from 'nodemailer';
import { config } from './config.js';
import { logger } from './logger.js';
import { welcomeEmailTemplate, confirmationEmailTemplate } from './emailTemplate.js';
const transporter = nodemailer.createTransport({
    host: 'smtp.sendgrid.net',
    port: 587,
    secure: false,
    auth: {
        user: 'apikey',
        pass: config.sendgrid.apiKey,
    },
});
export const sendWelcomeEmail = async (to) => {
    try {
        const template = welcomeEmailTemplate();
        const info = await transporter.sendMail({
            from: config.sendgrid.from,
            to,
            subject: template.subject,
            html: template.html,
            text: template.text,
            headers: {
                'X-Priority': '3',
                'X-Mailer': 'Trovo-Backend',
            },
        });
        logger.info({ email: to, messageId: info.messageId }, 'welcome email sent successfully');
        return { success: true, messageId: info.messageId };
    }
    catch (error) {
        logger.error({ email: to, err: error }, 'failed to send welcome email');
        throw error;
    }
};
export const sendConfirmationEmail = async (to) => {
    try {
        const template = confirmationEmailTemplate({ email: to });
        const info = await transporter.sendMail({
            from: config.sendgrid.from,
            to,
            subject: template.subject,
            html: template.html,
            text: template.text,
        });
        logger.info({ email: to, messageId: info.messageId }, 'confirmation email sent');
        return { success: true, messageId: info.messageId };
    }
    catch (error) {
        logger.error({ email: to, err: error }, 'failed to send confirmation email');
        throw error;
    }
};
