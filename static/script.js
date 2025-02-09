let currentHints = [];
let hintIndex = 0;
let countryName = "";

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("startBtn").addEventListener("click", startGame);
    
    // Add keyboard event listener for Enter key
    document.getElementById("guessInput").addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            checkGuess();
        }
    });
});

async function startGame() {
    // Reset game state
    hintIndex = 0;
    const hintSection = document.getElementById("hintSection");
    const hintsElement = document.getElementById("hints");
    const messageElement = document.getElementById("message");
    const guessInput = document.getElementById("guessInput");
    const startBtn = document.getElementById("startBtn");
    const gameControls = document.getElementById("gameControls");

    // Initial UI setup
    hintSection.style.display = "none";
    hintsElement.innerText = "Loading your adventure...";
    messageElement.innerText = "";
    guessInput.value = "";
    startBtn.style.display = "none";

    try {
        const response = await fetch("/start_game");
        const data = await response.json();

        if (data.status === "success") {
            currentHints = data.hints;
            
            // Show first hint with animation
            hintSection.style.display = "block";
            hintsElement.innerText = currentHints[hintIndex];
            
            // Show game controls after hint is displayed
            gameControls.style.display = "block";
            
            // Enable input and focus
            guessInput.disabled = false;
            guessInput.focus();
        } else {
            hintsElement.innerText = "Oops! Something went wrong. Please try again!";
            startBtn.style.display = "block";
            gameControls.style.display = "none";
        }
    } catch (error) {
        hintsElement.innerText = "Connection error. Please check your internet!";
        startBtn.style.display = "block";
        gameControls.style.display = "none";
    }
}

async function checkGuess() {
    const guessInput = document.getElementById("guessInput");
    const messageElement = document.getElementById("message");
    let userGuess = guessInput.value.trim();

    if (!userGuess) {
        messageElement.innerHTML = "Please enter your guess!";
        messageElement.className = "incorrect";
        return;
    }

    try {
        const response = await fetch("/check_answer", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ guess: userGuess })
        });

        const data = await response.json();

        if (data.status === "correct") {
            // Correct guess animation and message
            messageElement.innerHTML = `
                <p style="color: #00ff87">
                    🎉 Congratulations! You got it right!<br>
                    The country was <b>${userGuess}</b>!
                </p>`;
            messageElement.className = "correct";
            document.getElementById("gameControls").style.display = "none";
            showRestartButton();
        } else if (data.status === "incorrect") {
            hintIndex++;
            if (hintIndex < currentHints.length) {
                // Show next hint with animation
                document.getElementById("hints").innerText = currentHints[hintIndex];
                
                // Clear input and show incorrect message
                guessInput.value = "";
                messageElement.innerHTML = "Try again! Here's another hint...";
                messageElement.className = "incorrect";
                guessInput.focus();
            } else {
                // Game over state
                messageElement.innerHTML = `
                    <p style="color: #ff6b6b">
                        Game Over! The country was <b>${data.correct_country}</b>
                    </p>`;
                messageElement.className = "incorrect";
                document.getElementById("gameControls").style.display = "none";
                showRestartButton();
            }
        }
    } catch (error) {
        messageElement.innerText = "Error checking your guess. Please try again!";
        messageElement.className = "incorrect";
    }
}

function showRestartButton() {
    const restartButton = document.createElement("button");
    restartButton.innerText = "Play Again";
    restartButton.id = "startBtn";
    restartButton.onclick = () => window.location.reload();
    
    // Add button with animation
    document.querySelector(".game-container").appendChild(restartButton);
}