import React, { useEffect, useState, useMemo } from 'react';
import './app.css';
import ReactImage from './react.png';


// var ws = new WebSocket('ws://localhost:3001');

// ws.onopen = function() { console.log('hi') 
//   ws.send('connected')


//   fetch('https://en.wikipedia.org/w/api.php?origin=*&action=query&list=search&srsearch=Nelson%20Mandela&format=json')
//   .then(res => res.json())
//   .then(res => console.log(res));

// }
// ws.onmessage = function(ev) {
//   console.log(ev)
// }


let abortController = new AbortController() 


const Article = React.memo( function(props) {
  // console.log('rerendering article: ' + JSON.stringify(props))
  return ( 
    <>
      <div><a href={'http://en.wikipedia.org/wiki?curid='+props.pageID}>{props.title}</a></div>
      <div>{props.timestamp}</div>
      <div dangerouslySetInnerHTML={ {__html: props.snippet} }></div>
      <br />
    </>
  )
})


function ArticleHolder(props) {

  console.log('....')

  let contentHTML = <div> Enter a search term above </div>
  let articleTiles = [];
  if(Object.keys(props.searchResults).length > 0)
  {
    contentHTML = <div>There are {props.searchResults.searchinfo.totalhits} results. <br /> <br /> <b>See top 10 results below:</b> <br /> <br /></div>
    articleTiles = props.searchResults.search.map( article => 
        <Article key={article.pageid} pageID={article.pageid} title={article.title} snippet={article.snippet} timestamp={article.timestamp} />
    ) 
  }

  return (
    <div>
      {contentHTML}
      <ul>
        {articleTiles}
      </ul>
    </div>
  )
}



function App() {

  const [username, setUsername] = useState(null)
  const [searchResults, updateSearchResults] = useState({})

  useEffect( () => {
    fetch('/api/getUsername')
      .then(res => res.json())
      .then(user => setUsername(user.username));
  }, [])

  async function inputChange(event) {
    abortController.abort()
    abortController = new AbortController()

    try {
      let response = await fetch('https://en.wikipedia.org/w/api.php?origin=*&action=query&list=search&srsearch=' + event.target.value + '&format=json', { signal: abortController.signal })
      let data = await response.json() 

      console.log(data)
      if(data.error) 
        updateSearchResults({}) 
      else 
        updateSearchResults(data.query)
    } 
    catch (ex) {
      return
    }
  }

  return (
    <div>
      {username ? 
        <>
          <h1>Wikipedia Search Engine</h1> 
          <label>Type to search <input type='text' defaultValue='Enter text here' onChange={inputChange}></input></label>
          <br />
          <br />
          <ArticleHolder searchResults={searchResults} />
        </>
        : <h1>Loading.. please wait!</h1>}
    </div>
  )
}

export default App;




