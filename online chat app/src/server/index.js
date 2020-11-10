const express = require('express');
const os = require('os');

const app = express();

const WebSocketServer = require('ws').Server


app.use(express.static('dist'));
app.get('/api/getUsername', (req, res) => res.send({ username: os.userInfo().username }));


let chatRooms = {}

let wss = new WebSocketServer( { port: 3001 } )
wss.on('connection', (ws) =>
{
	console.log('new connection to chatroom list')

	ws.on('message', (msg) => 
	{
		console.log('message from client: ' + msg)
		msg = JSON.parse(msg)
		if(msg.type == 'requestRooms')
			ws.send( JSON.stringify( {type: 'list', chatRooms: chatRooms} ))
		else if(msg.type == 'new')
		{
			if(msg.name == '' || msg.name == null)
				ws.send(JSON.stringify({type: 'error', error: 'New chatroom name cannot be empty'}))
			else if(chatRooms[msg.name] != null)
				ws.send(JSON.stringify({type: 'error', error: 'Chatroom with that name already exists'}))
			else
			{
				chatRooms[msg.name] = { messages: [{ user: 'server', timestamp: new Date().getTime(), message: 'Room created at unixtime: ' + new Date().getTime() }], createdTime: new Date().getTime(), participants: [] }
				ws.send(JSON.stringify({type: 'list', chatRooms: chatRooms}))
			}
		}
	})
})



let chatWS = new WebSocketServer( { port: 3002 } ) 
chatWS.on('connection', ws => {
	console.log('new chat window conenction')

	ws.username = os.userInfo().username

	ws.on('message', msg => {

		console.log('new chat window message from client: ' + msg)
		msg = JSON.parse(msg) 

		if(msg.type == 'subscribe')
		{
			chatRooms[msg.name].participants.push(ws) 
			ws.send(JSON.stringify({ type: 'messages', messages: chatRooms[msg.name].messages }))
		}
		else if(msg.type == 'newMessage')
		{
			chatRooms[msg.name].messages.push({ user: ws.username, timestamp: new Date().getTime(), message: msg.message })
			// chatRooms[msg.name].participants.forEach( (participantWS) => {
			for(let i = chatRooms[msg.name].participants.length-1; i >= 0; i--)
			{
				let participantWS = chatRooms[msg.name].participants[i]
				if(participantWS.readyState == 1)
					participantWS.send(JSON.stringify({ type: 'messages', messages: chatRooms[msg.name].messages }))
				else if(participantWS.readyState == 3)
				{
					console.log('participants before:')
					console.log(chatRooms[msg.name].participants.length)
					participantWS.close()
					chatRooms[msg.name].participants.splice(i,1)
					console.log('participants after:')
					console.log(chatRooms[msg.name].participants.length)
				}
			}
		}
	})
}) 



app.listen(process.env.PORT || 5006, () => console.log(`Listening on port ${process.env.PORT || 5006}!`));











