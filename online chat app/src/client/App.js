import React, { Component, useEffect, useState } from 'react';
import './app.css';
import ReactImage from './react.png';



const ChatRoomIcon = React.memo( (props) => {
  console.log('creating chat room icon for: ' + props.name)
  return <><button onClick={ () => props.setChatRoomName(props.name) }>{props.name}</button><br/></>
})


const ChatWindow = function(props) {

  console.log('reloading chat window')

  const [chatWebsocket, setChatWebsocket] = useState(null)
  const [messages, setMessages] = useState([])
  const [messageText, setMessageText] = useState('')

  useEffect( () => {

    if(props.chatRoomName != null)
    {
      if(chatWebsocket != null)
        chatWebsocket.close()

      let ws = new WebSocket('ws://localhost:3002')
      ws.onopen = function() {
        console.log('chat window websocket connected')
        ws.send( JSON.stringify({ type: 'subscribe', name: props.chatRoomName }) )
      } 
      ws.onmessage = function(msg) {
        console.log(' new chat window message: ' + msg.data)

        let message = JSON.parse(msg.data)
        if(message.type == 'messages')
          setMessages(message.messages)
      }

      setChatWebsocket(ws)
    }

  }, [props.chatRoomName])


  function submitMessage(event) {
    event.preventDefault()
    inputRef.current.value = ''
    setMessageText('')
    chatWebsocket.send(JSON.stringify({ type: 'newMessage', username: props.username, name: props.chatRoomName, message: messageText }))
  }

  let inputRef = React.createRef()

  let messageHTML = messages.map( msg => 
    <div key={msg.user + msg.timestamp}>
      <h5 style={{width:'20%', display:'inline-block'}}>{new Date(msg.timestamp).toLocaleString()}</h5>
      <h3 style={{width:'80%', display:'inline-block', textAlign:'left'}}>{msg.user}: {msg.message}</h3>
    </div>
  )

  return( <div className='ChatWindow'>
            {messageHTML}
            <form>
              <input type="text" placeholder='Enter message' ref={inputRef} onChange={() => {setMessageText(event.target.value)}}></input>
              <button type="submit" onClick={submitMessage}>Send</button>
            </form>
          </div> )
}



function LeftPanel(props) {

  console.log('creating leftPanel')

  const [chatRooms, setChatRooms] = useState({})
  const [chatroomWebsocket, setChatroomWebsocket] = useState({})

  useEffect( () => {
    console.log('subscribing to chatrooms list websocket')
    
    let ws = new WebSocket('ws://localhost:3005')
    ws.onopen = function() {
      console.log('   chatroom list websocket opened')
      ws.send( JSON.stringify( { type: 'requestRooms' } ))
    }
    ws.onmessage = function(msg) {
      console.log('websocket message: ')
      console.log(JSON.parse(msg.data))
      let message = JSON.parse(msg.data)
      if(message.type == 'list')
        setChatRooms(JSON.parse(msg.data).chatRooms)
      else if(message.type == 'error')
        alert(message.error)
    }
    setChatroomWebsocket(ws)
  }, [])

  function createChatRoom()
  {
    console.log('creating chatroom')
    let name = prompt('What should the new room be called?')
    chatroomWebsocket.send( JSON.stringify( { type: 'new', name: name } ))
  }

  let leftPanelIcons = Object.entries(chatRooms).map( entry =>
    <ChatRoomIcon key={entry[0]} name={entry[0]} setChatRoomName={ props.setChatRoomName }/>
  )

  return(
    <div className='LeftPanel'>
      <div>{Object.keys(chatRooms).length} chat rooms</div>
      <br />
      <button onClick={createChatRoom}>Create new chat room</button> 
      <br />
      <br />
      {leftPanelIcons}
    </div>
  )
}


function App() {

  const [username, setUsername] = useState(null)
  const [chatRoomName, setChatRoomName] = useState(null)

  async function loadUsername() {
    setUsername(prompt("What's your name?"))
    // console.log('loading username')
    // let response = await fetch('/api/getUsername')
    // let data = await response.json() 
    // setUsername(data.username) 
  }

  useEffect( () => {
    loadUsername() 
  }, [])

  let contentHTML = username ? <h1>Hello {username}</h1> : <h1>Loading.. please wait!</h1>

  function setChatRmName(name) {
    setChatRoomName(name)
  }

  return(
    <div className='WindowHolder'> 
      {contentHTML}
      <div className='MainWindow' style={ chatRoomName ? {maxWidth:'100%'} : {maxWidth:'400%'} }>
        <LeftPanel setChatRoomName={setChatRmName} />
        <ChatWindow username={username} chatRoomName={chatRoomName}  />
      </div>
    </div>
  )
}


export default App 




