const nodemailer =require('nodemailer');
const config     =require('./mailer');


const transport= nodemailer.createTransport({
service :'Mailgun',
auth:{
    user:config.MAILGUN_USER,
    pass:config.MAILGUN_PASS
},
tls:{
    rejectUnatharized: false,
    }
});

module.exports = {
    sendEmail(from,to,subject,html){
        return new Promise((resolve,reject)=> {
            transport.sendMail({ form ,subject, to, html },(err,info)=>{
                if(err) {reject(err)};

                resolve(info);
            });
        });
    }
}

