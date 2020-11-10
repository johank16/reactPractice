import React, { useEffect, useState, useMemo } from 'react';
import './app.css';
import ReactImage from './react.png';



function Project(props) {
  return <a href={props.link}>{props.name}</a>
}


function App() {

  return (
    <div>
      <h1>Practice projects:</h1>
      <Project name='Image gallery' link='http://104.248.224.25:9000'></Project><br/>
      <Project name='Wikipedia search engine' link='http://104.248.224.25:9002'></Project><br/>
      <Project name='Online chat' link='http://104.248.224.25:9001'></Project><br/>
      <br />
      <Project name='github' link='https://github.com/johank16/reactPractice'></Project>
    </div>
  )
}

export default App;




