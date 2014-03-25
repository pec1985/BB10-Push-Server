
var APP_ID = '';
var PUSH_ID = '';
var PUSH_PASSWORD = '';
var CDIP = '';

function index(req, res) {
	res.render('index', { title: 'Welcome to Node.ACS!', message: '' });
}

function onPush(req, res) {
	console.log(req.body);
	
	var fail = false;
	var code = 200;
	var message;

	var obj = req.body;
	if(!obj.appId) {
		fail = true;
		code = 500;
		message = 'needs appId';
	}
	if(!obj.pushId) {
		fail = true;
		code = 500;
		message = 'needs pushId';
	}
	if(!obj.pushPassowrd) {
		fail = true;
		code = 500;
		message = 'needs pushPassowrd';
	}
	if(!obj.cdip) {
		fail = true;
		code = 500;
		message = 'needs cdip';
	}
	if(!obj.recipients) {
		fail = true;
		code = 500;
		message = 'needs recipients';
	}
	if(!obj.message) {
		fail = true;
		code = 500;
		message = 'needs message';
	}

	res.writeHead(code, {"Content-Type": "text/plain"});

	if(fail) {
		res.write(message);
		res.end();
		return;
	}

	var bb10 = require('node-bb10')
	var message = new bb10.PushMessage(obj.appId + '@' + new Date().getTime(), obj.message);
	var recipients = obj.recipients.split(',');
	message.addAllRecipients(recipients);
	message.setDeliveryMethod('unconfirmed');

	var initiator = new bb10.PushInitiator(obj.pushId, obj.pushPassowrd, obj.cdip, true);
	console.log('initiator....');
	initiator.push(message, function(err, result) {
		console.log('initiator.push');
	    if(err) {
	        console.log('Oops, something went wrong.');
	        console.log(err.statusCode);
	        console.log(err.message);
			res.write(err.message);
			res.end();
	    } else {
	        console.log(result.statusCode);
	        console.log(result.message);
			res.write(result.message);
			res.end();
	    }
	});

}