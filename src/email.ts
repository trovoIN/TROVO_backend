import sgMail from '@sendgrid/mail'
import { config } from './config.js'
import { logger } from './logger.js'
import { welcomeEmailTemplate, confirmationEmailTemplate } from './emailTemplate.js'

// Initialize SendGrid with API key
sgMail.setApiKey(config.sendgrid.apiKey)

export const sendWelcomeEmail = async (to: string) => {
  try {
    const template = welcomeEmailTemplate()

    const msg = {
      to,
      from: config.sendgrid.from,
      subject: template.subject,
      text: template.text,
      html: template.html,
    }

    const [response] = await sgMail.send(msg)

    logger.info({
      email: to,
      messageId: response.headers['x-message-id'],
      statusCode: response.statusCode
    }, 'welcome email sent successfully')

    return { success: true, messageId: response.headers['x-message-id'] }
  } catch (error: any) {
    logger.error({
      email: to,
      err: error,
      response: error.response?.body
    }, 'failed to send welcome email')
    throw error
  }
}

export const sendConfirmationEmail = async (to: string) => {
  try {
    const template = confirmationEmailTemplate({ email: to })

    const msg = {
      to,
      from: config.sendgrid.from,
      subject: template.subject,
      text: template.text,
      html: template.html,
    }

    const [response] = await sgMail.send(msg)

    logger.info({
      email: to,
      messageId: response.headers['x-message-id'],
      statusCode: response.statusCode
    }, 'confirmation email sent')

    return { success: true, messageId: response.headers['x-message-id'] }
  } catch (error: any) {
    logger.error({
      email: to,
      err: error,
      response: error.response?.body
    }, 'failed to send confirmation email')
    throw error
  }
}
