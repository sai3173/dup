let timer;
let isRunning = false;
let startTime;
let timeRemaining = 25 * 60; // Default 25 minutes
const dingSound = new Audio('ding.mp3'); // Replace with your sound file path
const muteButton = document.getElementById('mute');
const darkModeButton = document.getElementById('dark-mode');
let soundEnabled = true;

// Elements
const timerDisplay = document.getElementById('timer');
const startButton = document.getElementById('start');
const stopButton = document.getElementById('stop');
const resetButton = document.getElementById('reset');
const pomodoroButton = document.getElementById('pomodoro');
const shortBreakButton = document.getElementById('short-break');
const customInput = document.getElementById('custom-time');
const customButton = document.getElementById('custom');
const timerLabel = document.getElementById('timer-label');

// Ensure notification permissions
if ("Notification" in window && Notification.permission !== "granted") {
    Notification.requestPermission();
}

// Functions
function updateDisplay() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    document.title = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')} - Pomodoro Timer`;
}

function playSound() {
    if (soundEnabled) {
        const dingSound = document.getElementById('ding-sound');
        dingSound.currentTime = 0; // Reset the audio
        dingSound.play().catch(err => {
            console.error("Audio playback issue:", err);
        });
    }
}

stopButton.style.display = 'none';
function startTimer() {
    if (!isRunning) {
        playSound(); // Play start sound
        isRunning = true;
        startTime = Date.now();
        const endTime = startTime + timeRemaining * 1000;

        timer = setInterval(() => {
            const now = Date.now();
            timeRemaining = Math.max(0, Math.round((endTime - now) / 1000));
            updateDisplay();

            if (timeRemaining <= 0) {
                clearInterval(timer);
                isRunning = false;
                playSound(); // Play end sound
                new Notification("Time's up!", { body: "Your timer is done." });
                enableTimerButtons(); // Enable all timer buttons when the timer is finished
            }
        }, 1000);

        startButton.style.display = 'none';
        stopButton.style.display = 'inline-block';
        disableTimerButtons(); // Disable other timer buttons when the timer is running
    }
}

function stopTimer() {
    clearInterval(timer);
    playSound(); // Play start sound
    isRunning = false;
    startButton.style.display = 'inline-block';
    stopButton.style.display = 'none';
    enableTimerButtons(); // Enable all timer buttons when the timer is stopped
}

function resetTimer() {
    stopTimer();
    updateMode(timerLabel.textContent);
}

function updateMode(mode) {
    timerLabel.textContent = mode;
    if (mode === "Pomodoro") {
        timeRemaining = 25 * 60;
    } else if (mode === "Short Break") {
        timeRemaining = 15 * 60;
    } else {
        const customTime = parseInt(customInput.value);
        timeRemaining = isNaN(customTime) || customTime <= 0 ? 0 : customTime * 60;
    }
    updateDisplay();
}

// Disable all timer buttons when the timer is running
function disableTimerButtons() {
    pomodoroButton.disabled = true;
    shortBreakButton.disabled = true;
    customButton.disabled = true;
}

// Enable all timer buttons when the timer is stopped or completed
function enableTimerButtons() {
    pomodoroButton.disabled = false;
    shortBreakButton.disabled = false;
    customButton.disabled = false;
}

// Event Listeners
pomodoroButton.addEventListener('click', () => updateMode("Pomodoro"));
shortBreakButton.addEventListener('click', () => updateMode("Short Break"));
customButton.addEventListener('click', () => updateMode("Custom"));
startButton.addEventListener('click', startTimer);
stopButton.addEventListener('click', stopTimer);
resetButton.addEventListener('click', resetTimer);

muteButton.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    muteButton.textContent = soundEnabled ? "🔊" : "🔇";
});

darkModeButton.addEventListener('click', () => {
    document.body.classList.toggle("dark-mode");
});

// Initial Display
updateDisplay();
