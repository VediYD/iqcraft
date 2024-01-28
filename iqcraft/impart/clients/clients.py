import openai
from dotenv import dotenv_values


openai.api_key = dotenv_values('.env')
model_function = {}


def process_file(filename):
    return {'name': filename, 'location': '', 'biases': ['Bias 1', 'Bias 2', 'Bias 3', 'Bias 4']}


def get_ai_response(file_contents, model='gpt-3.5-turbo', ):
    response = openai.ChatCompletion.create(
        model=model,
        messages=[
            {"role": "system", "content": file_contents},
            {"role": "user", "content": 'can you identify the baises in this document?'}
        ]
    )

    return response
