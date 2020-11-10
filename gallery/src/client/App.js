import React, { Component, useState, useEffect } from 'react';
import './app.css';
import ReactImage from './react.png';
import LoadingImage from './loading.gif';



function App() {

  const [username, setUsername] = useState(null)
  const [authenticated, setAuthenticated] = useState(false)

  return authenticated ?
          <>
            <div>{username ? <h1>{'Hello '+username}</h1> : <h1>Loading.. please wait!</h1>}</div> 
            <CloudPage username={username} setUsername={setUsername} setAuthenticated={setAuthenticated} ></CloudPage>
          </> :
          <LoginPage username={username} setUsername={setUsername} setAuthenticated={setAuthenticated} ></LoginPage>
}



function CloudPage(props) {
  const [cloudFiles, setCloudFiles] = useState([])


  async function loadImageList() {

    console.log('loading image list')

    let response = await fetch('/api/fetchImageList', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({username: props.username})} )
    let data = await response.json() 
    if(data.success) 
      setCloudFiles(data.files)
    else
      console.log('error loading image list')
  }

  useEffect( () => { loadImageList() }, [])


  let fileIcons = cloudFiles.map( a => <ImageTile username={props.username} key={a} fileName={a}></ImageTile>)
  return (
      <div className='CloudPage'>
        {fileIcons}
        <br />
        <AddFile username={props.username} loadImageList={loadImageList}></AddFile>
      </div>
    )

}


function ImageTile(props) {

  const [imageSrc, setImageSrc] = useState(null)

  async function loadImage() {
    let response = await fetch('/api/fetchImage', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({username: props.username, fileName: props.fileName})} )
    let blob = await response.blob()
    setImageSrc(URL.createObjectURL(blob))
  }

  useEffect( () => { loadImage() }, [])

  return (
      <div className='galleryImage'>
        { imageSrc ? <img src={imageSrc}></img> : <img src={LoadingImage}></img> }
        <h5>{props.fileName}</h5>
      </div>
    )
}



function AddFile(props) {

  async function submitImage(event) {
    console.log(event) 

    const formData = new FormData();
    console.log(event.target.files[0])
    formData.append("username", props.username )
    formData.append("photo", event.target.files[0], event.target.files[0].name) //+'-'+props.username)
    let response = await fetch('/api/upload', { method: 'POST', body: formData })
    let data = await response.json() 
    if(data.success) 
    {
      console.log('image uploaded successfully')
      props.loadImageList()
    }
    else
      console.log('image upload failed')
  }

  return <div className='addFile'>
            <label>Add an image <br/><input type='file' onChange={submitImage} accept='image/*'></input></label>
         </div>
}



function LoginPage(props) {
  const [passwordField, setPasswordField] = useState('password')

  function updatePasswordField(event) {
    setPasswordField(event.target.value)
  }

  async function submitLogin(event) {
    event.preventDefault()
    let response = await fetch('/api/authenticate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify( { username: props.username, password: passwordField } ) } )
    try {
      let data = await response.json() 
      if(data.success) 
      {
        console.log('authenticated')
        props.setAuthenticated(true)
      }
      else
        console.log('failed authentication')
    }
    catch(e)
    {
      console.log('error with fetch request: ' + e.stack)
    }
  }

  return (<div className='LoginPage'>
            <h1>Please log in</h1>
            <form>
              <label className={props.username == '' ? 'input-error' : 'input'}>Enter username <input type='text' onChange={(event) => props.setUsername(event.target.value)}></input></label><br /><br />
              <label className={passwordField == '' ? 'input-error' : 'input'}>Enter password <input type='password' value='password' onChange={updatePasswordField}></input></label>
              <h6>The password has been hardcoded to always work</h6>
              <button onClick={submitLogin}>Submit</button>
            </form>
          </div>)
}





export default App;


