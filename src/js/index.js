const timerDisplay = document.getElementById("timer") // HTML-element for the timer
const topBar = document.getElementById("topbar") // HTML-element for the topbar

let holdTimer = false // When holding spacebar to start timer
let timerOn = false // When timer is running
let timeShown = true // When final time is shown

let elapsedTime = 0 // Time on the clock in ms
let startTime = 0 // Offset for calculating elapsed time
let animationFrameId = null

function startTimer() {
    timeElapsed = 0
    animationFrameId = requestAnimationFrame(updateTimer)
}

function stopTimer() {
    cancelAnimationFrame(animationFrameId)
    timerDisplay.textContent = formatTime(elapsedTime)
}

function updateTimer() {
    // Calculate the time from startTime to the time now
    elapsedTime = performance.now() - startTime

    // Display formated time to HTML-element
    timerDisplay.textContent = formatTime(elapsedTime)

    // If timer is still on, continue to loop updateTimer on each anim-frame
    if (timerOn) {
        animationFrameId = requestAnimationFrame(updateTimer)
    }
}

function formatTime(time) {
    // If time passed is 0 (reset time)
    if (time == 0) {
        return "00:00.00"
    }
    // Convert milliseconds into minutes, seconds and milliseconds
    const minutes = Math.floor(elapsedTime / 60000)
    const seconds = Math.floor((elapsedTime % 60000) / 1000)
    const milliseconds = elapsedTime % 1000

    // Formating each unit of time to minimum two digits
    const paddedMinutes = String(minutes).padStart(2, '0')
    const paddedSeconds = String(seconds).padStart(2, '0')
    const paddedMilliseconds = String(Math.trunc(milliseconds/10)).padStart(2, '0') // Milliseconds divied by 10 to keep it at max 2 digits.

    return `${paddedMinutes}:${paddedSeconds}.${paddedMilliseconds}`
}

window.addEventListener("keydown", function(event) {
    if (event.code === "Space" && !event.repeat) { // If spacebar is pressed (and not held)
        if (timeShown) { // If there is a final time shown, ready up the timer
            timeShown = false
            holdTimer = true
            timerDisplay.textContent = formatTime(0) // Reset HTML-timer to 0
            timerDisplay.classList.add("ready-timer")
            topBar.classList.add("hide") // Hide topbar
        } else if (timerOn) { // If the timer is running, stop the timer.
            elapsedTime = performance.now() - startTime // Calculate the time as fast as possible
            timerOn = false
            timeShown = true
            topBar.classList.remove("hide") // Show topbar
            stopTimer()
        }
    }
});

window.addEventListener("keyup", function(event) {
    if (event.code === "Space") { // If spacebar is released
        holdTimer = false
        if (!timerOn && !timeShown) { // If the timer isn't on and there is not a final time shown, start timer
            startTime = performance.now() // Set start offset as fast as possible
            timerOn = true
            timerDisplay.classList.remove("ready-timer")
            startTimer()
        }
    }
});