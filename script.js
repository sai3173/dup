let timer;
let isRunning = false;
let startTime; // Tracks when the timer starts
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
   document.title = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')} - Pomodoro Timer`;
}

function startTimer() {
   if (!isRunning) {
       isRunning = true;
       startTime = Date.now(); // Record the time when the timer starts
       const endTime = startTime + timeRemaining * 1000; // Calculate the end time

       timer = setInterval(() => {
           const now = Date.now();
           timeRemaining = Math.max(0, Math.round((endTime - now) / 1000)); // Calculate remaining time

           updateDisplay();

           if (timeRemaining <= 0) {
               clearInterval(timer);
               isRunning = false;

               // Reset buttons
               startButton.style.display = 'inline-block';
               stopButton.style.display = 'none';
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

   // Calculate remaining time accurately
   const now = Date.now();
   timeRemaining = Math.max(0, Math.round((startTime + timeRemaining * 1000 - now) / 1000));

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
