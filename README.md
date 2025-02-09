# Guess the Country Game

# Description
A dynamic web application that challenges users to guess countries based on progressive hints. The game combines geographical knowledge with an engaging user interface, featuring a modern design and real-time feedback system. Built with Flask backend and an interactive frontend using HTML, CSS, and JavaScript.

# Features
* Random Country Selection: Draws from countries across all seven continents
* Progressive Hint System: Hints evolve from general to specific
* Modern, Animated UI: Features gradient backgrounds, smooth transitions, and responsive design
* Real-time Feedback: Instant response to user guesses with visual feedback
* Cross-platform Compatibility: Optimized for both desktop and mobile devices
* Session Management: Tracks game progress and prevents country repetition

# Technologies Used
* Backend: 
  - Flask (Python)
  - Groq API for intelligent hint generation
  - Session management for game state
  - RESTful API endpoints

* Frontend:
  - HTML5
  - CSS3 (with animations and responsive design)
  - JavaScript (for interactive features)
  - Modern gradient and glassmorphism design elements

# Project Structure
```
guess-the-country/
├── static/
│   ├── style.css        # Main stylesheet
│   └── script.js        # Frontend JavaScript
├── templates/
│   └── index.html       # Main game interface
├── app.py              # Flask application
├── requirements.txt    # Project dependencies
└── .env               # Environment variables (not in repo)
```

# Setup and Installation
1. Clone the repository:
```bash
git clone https://github.com/meetgupta7388/Guess-the-Country.git
cd guess-the-country
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create a `.env` file with your credentials:
```
FLASK_SECRET_KEY=your_secret_key
GROQ_API_KEY=your_groq_api_key
```

5. Run the application:
```bash
python app.py
```

# Environment Variables
The following environment variables are required:
* `FLASK_SECRET_KEY`: Secret key for Flask session management
* `GROQ_API_KEY`: API key for Groq services

# Game Rules
1. Click "Start New Game" to begin
2. Read each hint carefully
3. Type your guess in the input field
4. Press Enter or click "Submit Guess" to check your answer
5. If incorrect, a new hint will be revealed
6. The game continues until you guess correctly or run out of hints

# Contributing
1. Fork the repository
2. Create a new branch (`git checkout -b feature/improvement`)
3. Make your changes
4. Commit your changes (`git commit -am 'Add new feature'`)
5. Push to the branch (`git push origin feature/improvement`)
6. Create a Pull Request

# Contact
Your Name - guptameet787@gmail.com
Project Link: https://guess-the-country-rbgg.onrender.com
