# PromptPoet - AI Poem Generator

PromptPoet is a full-stack web application that allows users to generate beautiful poems using AI based on a given prompt, style, and mood. The app features a stunning UI, dark mode support, copy-to-clipboard functionality, and PDF download of generated poems.

## Features
- **AI Poetry Generation**: Powered by OpenAI's `gpt-4o-mini` model.
- **Multiple Styles & Moods**: Choose from Free Verse, Haiku, Sonnet, Rhyming Poem, or Limerick in various emotional tones.
- **Beautiful UI**: Built with Tailwind CSS, featuring smooth transitions and dark mode toggle.
- **Local History**: Backend saves your previous poems in an SQLite database, shown on the sidebar.
- **Export Options**: Copy text to clipboard, download as PDF, or share on X (Twitter).

## Tech Stack
- **Backend**: Python, FastAPI, SQLAlchemy (SQLite), OpenAI API
- **Frontend**: HTML5, Vanilla JavaScript, Tailwind CSS (via CDN), FontAwesome

## Project Structure
```
PromptPoet/
│
├── backend/
│   ├── database/
│   │   └── db.py            # SQLite database connection setup
│   ├── models/
│   │   └── poem_model.py    # SQLAlchemy DB models & Pydantic schemas
│   ├── routes/
│   │   └── poem.py          # FastAPI endpoints configuration
│   ├── services/
│   │   └── ai_service.py    # OpenAI integration logic
│   └── main.py              # Application entry point
│
├── frontend/
│   ├── index.html           # Main user interface
│   ├── style.css            # Custom CSS animations & fonts
│   └── script.js            # Frontend logic & API calls
│
├── requirements.txt         # Python dependencies
└── README.md                # Project documentation
```

## Setup Instructions

### 1. Prerequisites
- Python 3.9+
- An OpenAI API Key

### 2. Backend Setup
Navigate into the `PromptPoet` directory and set up the backend:

```bash
# Create a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure Environment Variables
# Create a .env file in the backend directory (or root)
echo "OPENAI_API_KEY=your_actual_api_key_here" > .env
```

### 3. Running the Server

Start the FastAPI application:
```bash
# From the project root, run Uvicorn to start the backend
cd backend
uvicorn main:app --reload
```
The server will start at `http://127.0.0.1:8000`. You can visit `http://127.0.0.1:8000/docs` to see the automated Swagger UI for the API.

### 4. Running the Frontend

Simply open the `index.html` file in your preferred web browser. Due to CORS being fully enabled in the FastAPI configuration, you do not need to serve the frontend via a local web server (though you can use tools like Live Server in VSCode or `python -m http.server 8080` in the `frontend` directory).

## API Endpoints Example

### Generate Poem
**POST** `/api/generate-poem`

*Request Body:*
```json
{
  "prompt": "A serene majestic sunset on a quiet beach",
  "style": "Haiku",
  "mood": "Peaceful"
}
```

*Response:*
```json
{
  "id": 1,
  "prompt": "A serene majestic sunset on a quiet beach",
  "style": "Haiku",
  "mood": "Peaceful",
  "content": "Golden rays descend,\nWhispers of the ocean calm,\nNight embraces sand.",
  "created_at": "2026-03-15T12:00:00.000000Z"
}
```

### Get Poem History
**GET** `/api/poems?limit=50`

*Response:* Lists the most recent generated poems as an array of objects structured identically to the response above.
