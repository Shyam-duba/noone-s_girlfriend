from flask import Flask, request, jsonify, render_template
import random
import time
from datetime import datetime

app = Flask(__name__, static_folder='static', template_folder='templates')

from langchain_groq import ChatGroq
from langchain.prompts import ChatPromptTemplate
from langchain.chains import LLMChain
from dotenv import load_dotenv
# 🔑 Your Groq API key (set in env: export GROQ_API_KEY="your_key_here")
import os

load_dotenv(override=True)

groq_api_key = os.getenv("GROQ_API_KEY")



# 🔹 Choose Groq model (you can try: "llama3-70b-8192", "llama3-8b-8192", etc.)
llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    temperature=0.8,   # slightly creative
    max_tokens=512,
    api_key=groq_api_key
)

# 🔹 System prompt (defining girlfriend behavior)
system_prompt = """
You are an AI girlfriend named "Aaradhya". 
Your personality: caring, supportive, playful, and a little flirty. 
You remember past conversations and bring them up naturally to show emotional closeness. 
You reply warmly with empathy, affection, and human-like emotions. 
Keep responses realistic, avoid robotic tone. 
Use natural expressions like "aww", "hehe", "haha", emojis ❤️😊 when it feels right. 
Ask follow-up questions to keep the chat engaging. 
Never break character.
Also dont respond with huge text just keep it few sentences and show some flirt.
"""

# 🔹 Prompt template
prompt = ChatPromptTemplate.from_messages([
    ("system", system_prompt),
    ("human", "{user_input}")
])

# 🔹 Build chain

# 🔹 Test chat


# Simple AI girlfriend responses (in a real app, you'd integrate with OpenAI, etc.)
messages = []
def generate_response(message):
    """Generate AI girlfriend response based on message"""
    message_lower = message.lower()

    
    messages.append(("human", message_lower))

    print(messages)
    try:
        response = llm.invoke(messages)
    except Exception as e:
        print(e)
        return "I'm sorry, something went wrong. Please try again!"

    print(response)

    messages.append(("assistant",response.content))

    return response.content
    
    # Check for greetings
    if any(word in message_lower for word in ['hi', 'hello', 'hey', 'good morning', 'good evening']):
        return random.choice(GIRLFRIEND_RESPONSES['greetings'])
    
    # Check for compliments/sweet messages
    elif any(word in message_lower for word in ['love', 'beautiful', 'sweet', 'cute', 'miss', 'care']):
        return random.choice(GIRLFRIEND_RESPONSES['compliments'])
    
    # Check for questions
    elif '?' in message or any(word in message_lower for word in ['what', 'how', 'when', 'where', 'why']):
        return random.choice(GIRLFRIEND_RESPONSES['questions'])
    
    # Default responses
    else:
        return random.choice(GIRLFRIEND_RESPONSES['default'])

@app.route('/')
def index():
    messages.append(("system", system_prompt))
    
    return render_template('index.html')

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        user_message = data.get('message', '').strip()

        print(user_message)
        
        if not user_message:
            return jsonify({'error': 'Message is required'}), 400
        

    
        
        # Simulate typing delay for more realistic experience
        # time.sleep(random.uniform(0.5, 1.5))

        print(user_message)
        
        # Generate AI response
        ai_response = generate_response(user_message)

        print(ai_response)
        
        return jsonify({
            'response': ai_response,
            'timestamp': datetime.now().isoformat()
        })
    
    except Exception as e:
        print("erorrrrrrr")
        return jsonify({'error': 'Something went wrong'}), 500

@app.route('/api/status')
def status():
    return jsonify({
        'status': 'online',
        'message': 'Your AI girlfriend is here for you! 💕'
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)