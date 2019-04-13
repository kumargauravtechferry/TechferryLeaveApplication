// var  email = 'rduvedi@techferry.com',
//   pass = 'Techferry@123'
  nodemailer = require('nodemailer');

var smtpTransport = nodemailer.createTransport({
  service: process.env.MAILER_SERVICE_PROVIDER || 'Gmail',
  auth: {
    user: 'jayant9583@gmail.com',
    pass: 'jsr@23bistupur'
  }
});

// var handlebarsOptions = {
//   viewEngine: 'handlebars',
//   viewPath: ('./view/email/'),
//   extName: '.html'
// };

// smtpTransport.use('compile', hbs(handlebarsOptions));


module.exports = smtpTransport;