let timer;
let isRunning = false;
let timeRemaining = 25 * 60; // Default 25 minutes
let soundEnabled = true;
let currentMode = "Pomodoro"; // Default mode is Pomodoro

// Elements
const timerDisplay = document.getElementById('timer');
const startButton = document.getElementById('start');
const stopButton = document.getElementById('stop');
const resetButton = document.getElementById('reset');
const pomodoroButton = document.getElementById('pomodoro');
const shortBreakButton = document.getElementById('short-break');
const customInput = document.getElementById('custom-time');
const customButton = document.getElementById('custom');
const muteButton = document.getElementById('mute');
const darkModeButton = document.getElementById('dark-mode');

// Ensure notification permissions
if ("Notification" in window) {
    Notification.requestPermission().then(permission => {
        if (permission !== "granted") {
            alert("Notifications are blocked. Please enable them in your browser settings.");
        }
    });
}

// Update Timer Display
function updateDisplay() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    document.title = `Timer: ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// Play Sound
function playSound() {
    if (!soundEnabled) return; // Only play sound if enabled
    const dingSound = document.getElementById('ding-sound');
    if (dingSound) {
        dingSound.currentTime = 0; // Reset audio playback
        dingSound.play().catch(err => console.error("Audio playback issue:", err));
    } else {
        console.warn("Sound element not found.");
    }
}

// Start Timer
function startTimer() {
    if (!isRunning) {
        playSound(); // Play start sound
        isRunning = true;
        const endTime = Date.now() + timeRemaining * 1000;

        timer = setInterval(() => {
            timeRemaining = Math.max(0, Math.round((endTime - Date.now()) / 1000));
            updateDisplay();

            if (timeRemaining <= 0) {
                clearInterval(timer);
                isRunning = false;
                playSound(); // Play end sound

                // Notification logic
                handleTimerEnd();
                enableTimerButtons(); // Re-enable timer buttons
            }
        }, 1000);

        startButton.style.display = 'none';
        stopButton.style.display = 'inline-block';
        disableTimerButtons(); // Disable mode buttons while timer is running
    }
}

// Stop Timer
function stopTimer() {
    clearInterval(timer);
    isRunning = false;
    startButton.style.display = 'inline-block';
    stopButton.style.display = 'none';
    enableTimerButtons(); // Re-enable mode buttons
}

// Reset Timer
function resetTimer() {
    stopTimer();
    setTimeForCurrentMode();
    updateDisplay();
}

// Update Timer Mode
function updateMode(mode) {
    currentMode = mode;
    setTimeForCurrentMode();
    updateDisplay();
}

// Set Time Based on Current Mode
function setTimeForCurrentMode() {
    switch (currentMode) {
        case "Pomodoro":
            timeRemaining = 25 * 60;
            break;
        case "Short Break":
            timeRemaining = 15 * 60;
            break;
        case "Custom":
            const customTime = parseInt(customInput.value);
            timeRemaining = isNaN(customTime) || customTime <= 0 ? 0 : customTime * 60;
            break;
        default:
            timeRemaining = 25 * 60; // Default to Pomodoro if mode is unrecognized
            break;
    }
}

// Handle Timer End with Notifications and Alerts
function handleTimerEnd() {
    if ("Notification" in window && Notification.permission === "granted") {
        if (document.visibilityState !== "visible") {
            new Notification("Time is up!", { body: "" });
        } else {
            alert("Time is up!.");
        }
    } else {
        alert("Time is up!.");
    }
}

// Disable Timer Buttons
function disableTimerButtons() {
    pomodoroButton.disabled = true;
    shortBreakButton.disabled = true;
    customButton.disabled = true;
}

// Enable Timer Buttons
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

// Initial Setup
stopButton.style.display = 'none';
updateDisplay();