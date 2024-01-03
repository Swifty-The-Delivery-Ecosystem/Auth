const nodemailer = require('nodemailer');


let mailTransporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'adityavinay@iitbhilai.ac.in',
		pass: 'afbu jlzp wolw qhya'
	}
});

let mailDetails = {
	from: 'adityavinay@iitbhilai.ac.in',
	to: 'hrzenskar@gmail.com',
	subject: 'Test mail',
	text: 'Node.js testing mail for GeeksforGeeks'
};

mailTransporter.sendMail(mailDetails, function(err, data) {
	if(err) {
		console.log('Error Occurs');
    console.log(err)
	} else {
		console.log('Email sent successfully');
	}
});
