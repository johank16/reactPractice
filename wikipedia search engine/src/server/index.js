const express = require('express');
const os = require('os');

const ws = require('ws');

const app = express();
// const expressWs = require('express-ws')(app);

app.use(express.static('dist'));
app.get('/api/getUsername', (req, res) => { console.log('sending username'); res.send({ username: os.userInfo().username }); });

app.post('/api/saveSearchSettings', (req, res) => {
	console.log('settings are being saved: ' + JSON.stringify(req))
	res.send({success: true})
})

app.get('/api/hi', (req, res) => 
{ 
	console.log('sending success message for /hi '); 
	res.send({ success: true, message: 'you did it!' })
});


// const WebSocketServer = require('ws').Server
// const wss = new WebSocketServer({port:5008})
// wss.on('connection', function(ws) {
// 	ws.on('message', function(msg)
// 	{
// 		console.log("received message: " + msg)
// 	})
// })


app.listen(process.env.PORT || 5007, () => console.log(`Listening on port ${process.env.PORT || 5007}!`));
