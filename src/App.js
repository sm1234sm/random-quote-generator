import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const BASE_URL = "https://goquotes-api.herokuapp.com/api/v1/random?count=1";
var TWEET_URL = "https://twitter.com/intent/tweet?text=";


const initialState = {
  loading: true,
  error: false,
  quote: null,
  twitterLink: null
}

const Quote = (props) => {
  if (!props.error) {
    if (props.loading) {
      return (
        <div id="quote">
          <h1>Loading</h1>
        </div>
      )
    } else {
      return (
        <div id="quote">
          <q id="quoteText">{props.quote.text}</q>
          <hr />
          <span id="quoteAuthor">{props.quote.author}</span>
        </div>
      )
    }
  } else {
    return (
      <div id="quote">

      </div>
    )
  }
}

function resetAnimation() {
  
  const bodyElt = document.querySelector("body");
  bodyElt.style.backgroundImage = `linear-gradient(270deg, ${randomColor()}, ${randomColor()})`;
  //elt.style.animation = 'none';
  // eslint-disable-next-line no-unused-expressions
  //el.offsetHeight; /* trigger reflow */
  //el.style.animation = null; 
}

const Info = (props) => {
  return (
    <div id="info">
      <span id="generate" onClick={() => props.handleQuoteRequest()}>New Quote</span>
      <span id="tweet" onClick={() => props.handleTwitterWindow()} >Tweet</span>
    </div>
  )
}

const randomColor = () => {
  function gen() {
      return Math.floor(Math.random() * 255);
  }
  return "rgb(" + gen() + "," + gen()  + "," + gen() + ")";
}

const App = () => {
  const [state, setState] = useState(initialState);

  const fetchData = async () => {
    setState(prevState => ({
      ...prevState,
      loading: true
    }))
    try {
      const result = await axios({
        method: 'get',
        url: BASE_URL,
        crossDomain: true
      })
      console.log(result);
      if (result.status === 200) {
        const quote = result.data.quotes[0];
        setState(prevState => ({
          ...prevState,
          loading: false,
          error: false,
          quote: quote,
          twitterLink: TWEET_URL + "%22" + encodeURI(quote.text) + "%22%20%2D%20" + encodeURI(quote.author)
        }));
        const bodyElt = document.querySelector("body");
        bodyElt.style.backgroundImage = `linear-gradient(270deg, ${randomColor()}, ${randomColor()})`;
        console.log(bodyElt.style.background);
      } else {

      }
    } catch (err) {
      setState(prevState => ({
        ...prevState,
        loading: true,
        error: true,
        quote: null
      }))
    }
  };

  const showTwitterWindow = () => {
    window.open(state.twitterLink, 'newwindow', 'width=500, height=450');
  }

  useEffect(() => {
    fetchData();

  }, [])

  return (
    <div className="App">
      <div id="container">
        <Quote quote={state.quote} loading={state.loading} error={state.error} />
        <Info handleQuoteRequest={fetchData} handleTwitterWindow={showTwitterWindow} />
      </div>
    </div>
  );
}

export default App;
