import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';
import config from '../config.js'

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user:  config.MAIL_CONFIG_ID,
      pass: config.MAIL_PASSWORD,
    },
});

// Configure mailgen by setting a theme and your product info
var mailGenerator = new Mailgen({
    theme: 'default',
    product: {
        // Appears in header & footer of e-mails
        name: 'MERN Authentication App',
        link: 'https://www.linkedin.com/in/chinmoy-biswas-81ab81212/'
        // Optional product logo
        // logo: 'https://mailgen.js/img/logo.png'
    }
});

/** POST: http://localhost:8080/api/registerMail
 @param: {
    "username" : "example123",
    "userEmail" : "chinmoy@example.com",
    "subject" : "Registration Successfull!"
 }
*/
export const registerMail = async (req, res) =>  {
  const {username, userEmail, subject} = req.body;
  try {
    var email = {
        body: {
            name: username,
            intro: 'Welcome! You have succesfully registered with us',
            action: {
                instructions: 'Please log in to the app to update your  details',
                button: {
                    color: '#22BC66', // Optional action button color
                    text: 'Go to our linkdin',
                    link: 'https://www.linkedin.com/in/chinmoy-biswas-81ab81212/'
                }
            },
            outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
        }
    };
    
    // Generate an HTML email with the provided contents
    var emailBody = mailGenerator.generate(email);
    const mailOptions =  {
        from: config.MAIL_CONFIG_ID, // sender address
        to: userEmail, // list of receivers
        subject: subject, // Subject line
        html: emailBody, // html body
      };
    // send mail with defined transport object      
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return res.status(500).send({error:true, msg:"Error in Sending mail"})
          console.error('Error:', error);
        } else {
          console.log('Email sent:', info.response);
          return res.status(200).send({msg:"Mail has been send successfully!"})
        }
        // Close the transporter
        transporter.close();
      });
  } catch (error) {
     return res.status(500).send({error:true, msg:"Error in Sending mail"})
  }

}


/** POST: http://localhost:8080/api/registerMail
 @param: {
    "username" : "example123",
    "userEmail" : "chinmoy@example.com",
    "subject" : "Registration Successfull!"
 }
*/
export const sendMail = async (req, res) =>  {
  const {username, userEmail, subject, intro} = req.body;
  try {
    var email = {
        body: {
            name: username,
            intro,
            outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
        }
    };
    
    // Generate an HTML email with the provided contents
    var emailBody = mailGenerator.generate(email);
    const mailOptions =  {
        from: config.MAIL_CONFIG_ID, // sender address
        to: userEmail, // list of receivers
        subject: subject, // Subject line
        html: emailBody, // html body
      };
    // send mail with defined transport object      
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return res.status(500).send({error:true, msg:"Error in Sending mail"})
          console.error('Error:', error);
        } else {
          console.log('Email sent:', info.response);
          return res.status(200).send({msg:"Mail has been send successfully!"})
        }
        // Close the transporter
        transporter.close();
      });
  } catch (error) {
     return res.status(500).send({error:true, msg:"Error in Sending mail"})
  }

}