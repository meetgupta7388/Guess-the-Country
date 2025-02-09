from flask import Flask, jsonify, render_template, request, session
import os
import requests
import re
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv("FLASK_SECRET_KEY", "supersecretkey")  # Use env variable for security

# Fetch API key from environment variables
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

def get_country_hints():
    prompt = """
You are a geography expert. First randomly select one continent from: Africa, Asia, Europe, North America, South America, or Oceania. Then randomly select a country from that chosen continent and give exactly 10 hints about it. The hints should progress from vague to very specific. Follow this exact format with no other text or explanations:

[First hint like which country is in which continent]
[Second hint like for which it is famous for in whole world]
[Third hint like area and population]
[Fourth hint like physical description of country]
[Fifth hint like starting alphabet of country name]
[Sixth hint like capital of country]
[Seventh hint like flag description whith emoji if available]
[Eighth hint]
[Ninth hint]
[Final hint]

Answer: [Country Name]
Rules:

Start hints broadly (geography, history, culture)
Progress to more specific details
Make the final hints very obvious
No additional text before or after
No questions or interactive elements
Stick to exactly 10 numbered hints
End with 'Answer:' followed by the country name
Keep format exactly as shown above
"""

    try:
        response = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {GROQ_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": "llama3-70b-8192",
                "messages": [{"role": "user", "content": prompt}],
                "temperature": 0.7
            }
        )
        
        if response.status_code != 200:
            print(f"Error: {response.status_code} - {response.text}")
            return None, None

        # Extract API response
        data = response.json()
        raw_text = data["choices"][0]["message"]["content"].strip()

        # Debugging: Print full response
        print("==== RAW API RESPONSE ====")
        print(raw_text)
        print("==========================")

        return parse_api_response(raw_text)

    except Exception as e:
        print(f"Exception: {str(e)}")
        return None, None

def parse_api_response(raw_response):
    hints = []
    country = None

    # Extract hints (lines that start with a number and a period)
    hint_matches = re.findall(r"\d+\.\s(.+)", raw_response)
    if hint_matches:
        hints.extend(hint_matches)

    # Extract country name after "Answer:"
    country_match = re.search(r"Answer:\s(.+)", raw_response)
    if country_match:
        country = country_match.group(1).strip()

    return hints, country


@app.route("/")
def index():
    return render_template("index.html")

@app.route("/start_game", methods=["GET"])
def start_game():
    hints, country = get_country_hints()
    print(f"Hints: {hints}, Country: {country}")  # Debugging output

    if hints and country:
        session["correct_country"] = country  # Store correct answer in session
        return jsonify({"status": "success", "hints": hints})  # Hide answer from client
    else:
        return jsonify({"status": "error", "message": "Failed to retrieve valid hints from Groq."})

@app.route("/check_answer", methods=["POST"])
def check_answer():
    user_guess = request.json.get("guess", "").strip().lower()
    correct_country = session.get("correct_country", "").strip().lower()

    if not correct_country:
        return jsonify({"status": "error", "message": "No active game. Please start a new game."})

    if user_guess == correct_country:
        return jsonify({"status": "correct", "message": "🎉 Correct! You guessed the country!"})
    else:
        return jsonify({
            "status": "incorrect",
            "message": "❌ Incorrect guess. Try again!",
            "correct_country": correct_country  # Send correct country when out of hints
        })


if __name__ == "__main__":
    app.run(debug=True)
