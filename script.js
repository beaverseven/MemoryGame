//Global Variables
const cluePauseTime = 333; //how long to pause in between clues
const nextClueWaitTime = 1000; //how long to wait before starting playback of the clue sequence

var clueHoldTime = 1000;
var mistakes; 
//var pattern = [2, 2, 5, 4, 5, 3, 2, 1, 2, 4];
var progress = 0;
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.5;
var guessCounter = 0;
var pattern = new Array(10);

function randomize(mini,maxi) {
  if(gamePlaying)
    {
      var pattern = new Array(10);
      var random;
      var min;
      var max;
      for(let i =0;i<=9;i++)
    {
        min = Math.ceil(mini);
        max = Math.floor(maxi);
        random = Math.floor(Math.random() * (max - min) + min)
        pattern[i] = random;
    }
    return pattern;
    }
     
}

function startGame() {
  //initialize game variables
  mistakes = 0;
  progress = 0;
  gamePlaying = true;
  pattern = randomize(1,6);
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("stopBtn").classList.remove("hidden");
  playClueSequence();
}

function stopGame() {
  gamePlaying = false;
  document.getElementById("startBtn").classList.remove("hidden");
  document.getElementById("stopBtn").classList.add("hidden");
  clueHoldTime=1000;
}

// Sound Synthesis Functions
const freqMap = {
  1: 300.6,
  2: 350.6,
  3: 392,
  4: 466.2,
  5: 500
};


function playTone(btn, len) {
  o.frequency.value = freqMap[btn]
  g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025)
  tonePlaying = true
  setTimeout(function() {
    stopTone()
  }, len)
} 



function startTone(btn) {
  if (!tonePlaying) {
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025)
    tonePlaying = true
  }
} 

function stopTone() {
  g.gain.setTargetAtTime(0, context.currentTime + 0.05, 0.025)
  tonePlaying = false
}

function showimage(btn)
{
  document.getElementById("img"+ btn).classList.remove("hidden");
  
}

function hideimage(btn)
{
  document.getElementById("img"+ btn).classList.add("hidden");

}

//Page Initialization
// Init Sound Synthesizer
var context = new AudioContext();
var o = context.createOscillator();
var g = context.createGain();
g.connect(context.destination);
g.gain.setValueAtTime(0, context.currentTime);
o.connect(g);
o.start(0);

function lightButton(btn) {
  document.getElementById("button" + btn).classList.add("lit");
}
function clearButton(btn) {
  document.getElementById("button" + btn).classList.remove("lit");
}

function playSingleClue(btn) {
  if (gamePlaying) {
    lightButton(btn);
    playTone(btn, clueHoldTime);
    setTimeout(clearButton, clueHoldTime, btn);
  }
}

function playClueSequence() {
  guessCounter = 0;
  let delay = nextClueWaitTime; //set delay to initial wait time
  for (let i = 0; i <= progress; i++) {
    // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms");
    setTimeout(playSingleClue, delay, pattern[i]); // set a timeout to play that clue
    delay += clueHoldTime;
    delay += cluePauseTime;
  }
  clueHoldTime -=50;
}

function loseGame() {
  stopGame();
  alert("Game Over. You lost.");
  clueHoldTime = 1000;
}

function winGame() {
  stopGame();
  alert("You win!");
  clueHoldTime = 1000;
}

function guess(btn) {
  console.log("user guessed: " + btn);
  if (!gamePlaying) {
    return;
  }

  if (pattern[guessCounter] == btn) {
    if (guessCounter == progress) {
      if (progress == pattern.length - 1) {
        winGame();
      } else {
        progress++;
        playClueSequence();
      }
    } else {
      guessCounter++;
    }
  } else {
    mistakes++;
    if(mistakes==3)
      {
        loseGame();
        clueHoldTime=1000;
      }
    else
      {
        progress++;
        playClueSequence();

      }
  }

  // add game logic here
}
