import openai
from dotenv import dotenv_values

print(dotenv_values('.env'))

openai.api_key = dotenv_values('.env')
model_function = {}


def process_file(filename):
    return {'name': filename, 'location': ''}


def get_ai_response(file_contents, model='gpt-3.5-turbo', ):
    response = openai.ChatCompletion.create(
        model=model,
        messages=[
            {"role": "system", "content": file_contents},
            {"role": "user", "content": 'can you identify the baises in this document?'}
        ]
    )

    return response
