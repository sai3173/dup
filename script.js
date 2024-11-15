let timer;
let isRunning = false;
let timeRemaining = 25 * 60; // 25 minutes in seconds
const totalTime = timeRemaining;

const timerDisplay = document.getElementById('timer');
const startButton = document.getElementById('start');
const stopButton = document.getElementById('stop');
const resetButton = document.getElementById('reset');


// Initially hide the stop button
stopButton.style.display = 'none';

function updateDisplay() {
   const minutes = Math.floor(timeRemaining / 60);
   const seconds = timeRemaining % 60;
   timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

   // Update progress bar width
   
}

function startTimer() {
   if (!isRunning) {
       isRunning = true;
       timer = setInterval(() => {
           if (timeRemaining > 0) {
               timeRemaining--;
               updateDisplay();
           } else {
               clearInterval(timer);
               isRunning = false;
           }
       }, 1000);
       
       // Toggle button display: hide "Start", show "Pause"
       startButton.style.display = 'none';
       stopButton.style.display = 'inline-block';
   }
}

function stopTimer() {
   clearInterval(timer);
   isRunning = false;

   // Toggle button display: show "Start", hide "Pause"
   startButton.style.display = 'inline-block';
   stopButton.style.display = 'none';
}

function resetTimer() {
   stopTimer();
   timeRemaining = totalTime; // Reset to original time
   updateDisplay();
}

// Event Listeners
startButton.addEventListener('click', startTimer);
stopButton.addEventListener('click', stopTimer);
resetButton.addEventListener('click', resetTimer);

// Initial display update
updateDisplay();
