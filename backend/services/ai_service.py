import os
from openai import AsyncOpenAI
from dotenv import load_dotenv

load_dotenv()

# Initialize the client. It will automatically use the OPENAI_API_KEY environment variable.
client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

async def generate_poem_from_ai(prompt: str, style: str, mood: str = None) -> str:
    \"\"\"
    Calls OpenAI to generate a poem based on prompt, style, and mood.
    \"\"\"
    system_prompt = (
        "You are an expert, creative poet. You write incredibly beautiful and moving poetry. "
        "Your output must ONLY be the poem itself, with no conversational filler, "
        "no titles (unless requested), and no markdown formatting surrounding it."
    )
    
    mood_text = f" in a {mood} mood" if mood else ""
    user_prompt = f"Write a {style} poem about '{prompt}'{mood_text}."
    
    try:
        response = await client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.7,
            max_tokens=500
        )
        poem_content = response.choices[0].message.content.strip()
        return poem_content
    except Exception as e:
        print(f"Error calling OpenAI API: {e}")
        # Fallback or re-raise
        raise e
