// Initialize WebGazer
window.onload = function () {
    webgazer.setRegression('ridge') // Use ridge regression for better accuracy.
        .setTracker('clmtrackr')   // Use clmtrackr for face tracking.
        .begin()
        .showPredictionPoints(true); // Display gaze prediction points (for debugging).

    console.log("WebGazer initialized. Allow camera access.");

    // Add calibration points
    setupCalibration();
};

// Scroll speed (adjust as needed)
const SCROLL_SPEED = 10;

// Threshold for detecting gaze direction
const GAZE_THRESHOLD = 50;

// Function to determine scroll direction based on gaze y-coordinates
function processGaze(data) {
    if (!data) return;

    const viewportHeight = window.innerHeight;
    const y = data.y;

    if (y < GAZE_THRESHOLD) {
        console.log("Looking up - scrolling up");
        window.scrollBy(0, -SCROLL_SPEED);
    } else if (y > viewportHeight - GAZE_THRESHOLD) {
        console.log("Looking down - scrolling down");
        window.scrollBy(0, SCROLL_SPEED);
    }
}

// Polling gaze data at intervals
setInterval(() => {
    const gaze = webgazer.getCurrentPrediction();
    if (gaze) {
        console.log("Gaze detected:", gaze);
        processGaze(gaze);
    } else {
        console.log("No gaze detected");
    }
}, 100);

// Event listener for cleanup when user leaves
window.onbeforeunload = function () {
    webgazer.end();
};

// Calibration setup
function setupCalibration() {
    const calibrationMessage = document.createElement("div");
    calibrationMessage.textContent = "Please move your eyes to different parts of the screen for calibration.";
    calibrationMessage.style.position = "fixed";
    calibrationMessage.style.top = "10px";
    calibrationMessage.style.left = "50%";
    calibrationMessage.style.transform = "translateX(-50%)";
    calibrationMessage.style.backgroundColor = "#333";
    calibrationMessage.style.color = "#fff";
    calibrationMessage.style.padding = "10px";
    calibrationMessage.style.borderRadius = "5px";
    calibrationMessage.style.zIndex = 1000;

    document.body.appendChild(calibrationMessage);

    // Remove calibration message after 10 seconds
    setTimeout(() => {
        document.body.removeChild(calibrationMessage);
    }, 10000);
}
