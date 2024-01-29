from dotenv import load_dotenv
from PyPDF2 import PdfReader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.vectorstores import FAISS
from langchain.llms import OpenAI
from langchain.chains.question_answering import load_qa_chain
from langchain.callbacks import get_openai_callback
import os
import pickle


load_dotenv('iqcraft/impart/clients/.env')
legal_reasoning_questions = [
    "What is this legal document about? Is it a court case, contract agreement etc? "
    "What is the purpose of this document?",
    "What is the context of the document? What are the relevant parties mentioned in this document? "
    "Who are the important members mentioned in this document? "
    "What is the role and responsibility of involved parties?",
    "Which laws regulations or statues are referenced in this document? "
    "Does the document provide any explanations for said statues "
    "that deviate from whats traditionally accepted by society?",
    "What are the conditions or terms outlined in the document? "
    "Are the terms sensible? Are there any gaps in the terms mentioned in the document?",
    "What is the final summary of the document? What are the conclusions (if any) that can be made from the document?"
]


def openai_reponse(text, vecstore):
    docs = vecstore.similarity_search(query=text, k=10)
    llm = OpenAI()
    chain = load_qa_chain(llm=llm, chain_type="stuff")
    with get_openai_callback() as cb:
        response = chain.run(input_documents=docs, question=text)
    return response


model_function = {'gpt-3.5-turbo': openai_reponse}


def process_file(file_path):
    if not os.path.isfile(file_path):
        # if pdf file exists
        raise FileNotFoundError('Passed file path is not a file / doesnt exists.')

    pdf_reader = PdfReader(file_path)
    text = ""
    for page in pdf_reader.pages:
        text += page.extract_text()

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        length_function=len
    )
    chunks = text_splitter.split_text(text=text)

    embeddings = OpenAIEmbeddings()
    vecstore = FAISS.from_texts(chunks, embedding=embeddings)

    processed_data = {'name': file_path, 'location': file_path, 'model_biases': {}}
    for idx, (model, function) in enumerate(model_function.items()):
        processed_data['model_biases'][f'model{idx}_biases'] = {
            'model_name': model, 'biases': [model_function[model](i, vecstore) for i in legal_reasoning_questions]
        }

    return processed_data
