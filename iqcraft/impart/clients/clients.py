import openai
from dotenv import dotenv_values


openai.api_key = dotenv_values('.env')
model_function = {}


def process_file(filename):
    return {
        'name': filename,
        'location': '',
        'model_biases': {
            'model1_biases': {'model_name': 'Model 1', 'biases': ['Bias 1', 'Bias 2', 'Bias 3', 'Bias 4']},
            'model2_biases': {'model_name': 'Model 2', 'biases': ['Bias 5', 'Bias 6', 'Bias 7', 'Bias 8']},
            'model3_biases': {'model_name': 'Model 3', 'biases': ['Bias 9', 'Bias 10', 'Bias 11', 'Bias 12']},
            'model4_biases': {'model_name': 'Model 4', 'biases': ['Bias 13', 'Bias 14', 'Bias 15', 'Bias 16']},
        }
    }


def get_ai_response(file_contents, model='gpt-3.5-turbo', ):
    response = openai.ChatCompletion.create(
        model=model,
        messages=[
            {"role": "system", "content": file_contents},
            {"role": "user", "content": 'can you identify the baises in this document?'}
        ]
    )

    return response
