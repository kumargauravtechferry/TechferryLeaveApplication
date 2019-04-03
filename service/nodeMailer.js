// var  email = 'rduvedi@techferry.com',
//   pass = 'Techferry@123'
  nodemailer = require('nodemailer');

var smtpTransport = nodemailer.createTransport({
  service: process.env.MAILER_SERVICE_PROVIDER || 'Gmail',
  auth: {
    user: 'rajatduvedi.bhumca2014@gmail.com',
    pass: 'iwillfight'
  }
});

// var handlebarsOptions = {
//   viewEngine: 'handlebars',
//   viewPath: ('./view/email/'),
//   extName: '.html'
// };

// smtpTransport.use('compile', hbs(handlebarsOptions));


module.exports = smtpTransport;