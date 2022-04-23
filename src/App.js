import React, { useState, useEffect } from 'react'
import './App.css'
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import logo from './img/logo.JPG';


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  colorbar:{
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
    height: 48,
    padding: '0 30px',
  }
}));


const SpeechRecognition = window.speechRecognition || window.webkitSpeechRecognition;
const mic = new SpeechRecognition();

var finalNote = null;
var startrec=false;

mic.continuous = true
mic.interimResults = true
mic.lang = 'pt-BR'


function App() {
  const [isListening, setIsListening] = useState(false)
  const [note, setNote] = useState(null)
  const [savedNotes, setSavedNotes] = useState([])
  const classes = useStyles();


  useEffect(() => {
    handleListen()
  }, [isListening])

  const handleListen = () => {
    startrec=true;
    if (isListening) {
      mic.start()
      mic.onend = () => {
        console.log('continuar..')
        mic.start()
      }
    } else {
      mic.stop()
      mic.onend = () => {
        console.log('Parar o Microfone em um click')
      }
    }
    mic.onstart = () => {
      console.log('Mic on')
    }

    mic.onresult = event => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('')
      console.log(transcript)
      setNote(transcript)
      mic.onerror = event => {
        console.log(event.error)
      }
    }
  }

  const downloadTxtFile = () => {
    const element = document.createElement("a");
    const file = new Blob([document.getElementById("paragraph1").innerText], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "minhaNota.txt";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  }

  const handleSaveNote = () => {
    startrec=false;
    setSavedNotes([savedNotes, note])
    finalNote = note;
    setNote('')
    setIsListening(prevState => !prevState)
  }

  return (
    <>
      <div className={classes.root} >
          <AppBar position="static" style={{ background: 'linear-gradient(to right, #130b33 30%, #99015c 90%)' }}>
            <Toolbar >
              <img src={logo} alt="Logo" />
              <Typography variant="h6" className={classes.title} color="inherit">
              &nbsp;&nbsp;&nbsp;Lessons Learned
              </Typography>
            </Toolbar>
          </AppBar>
        </div>
        
        <div className="container">
        <div className="box">
          <h2>Nota Atual</h2>
          {isListening ? <span role="img" aria-label="mic on">🎙️</span> : <span role="img" aria-label="mic off">🛑 🎙️</span>}
          <button onClick={handleSaveNote} disabled={!note}>
            Concluir Nota
          </button>
          <button onClick={() => setIsListening(prevState => !prevState)} disabled={startrec}>
            Começar a Gravar
          </button>
          <p>{note}</p>
        </div>
        <div className="box">
          <h2>Nota feita</h2>
          <button onClick={downloadTxtFile}>
            Salvar Nota
          </button><br></br>
          <p id={'paragraph1'} contentEditable="true">{finalNote}</p>
          
        </div>
      </div>

      <footer className="footer" id="footer">
      </footer>

    </>
  )
}

export default App 