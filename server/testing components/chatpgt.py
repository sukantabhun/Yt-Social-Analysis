from openai import OpenAI
client = OpenAI(api_key='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')

# Set the OpenAI API key

def generate_ai_suggestions():
    prompt = """
    You are an expert in YouTube content optimization. Based on the following video information:
    - Title: Delhi Ride
    - Description: random(example)
    - Tags: #test
    - Channel Engagement Rate: 4%

    Suggest:
    1. A better, more engaging title.
    2. An improved description.
    3. Few hashtags that can improve engagement (minimum 3).
    Make sure to suggest content optimized for higher engagement considering past performance and return in a valid JSON like structure but keep it in string with all three separated.
    """

    try:
        response = client.chat.completions.create(model="gpt-4o-mini",  # Use "gpt-4" or another valid model name
        messages=[{"role": "system", "content": prompt}],
        temperature=0.7)

        # Parse the response to extract the suggestions
        suggestions = response.choices[0].message.content     
        return suggestions
    except Exception as e:
        return {"error": str(e)}

# Test the function
ai_suggestions = generate_ai_suggestions()
print(ai_suggestions)