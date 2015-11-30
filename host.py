from flask import Flask
from flask import render_template
import requests
app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/question')
def question():
    return render_template('question.html')

@app.route('/result/')
def result_without():
    return render_template('result.html');

@app.route('/result/<qid>')
def result(qid):
    if qid:
        return render_template('result.html', qid=qid)

if __name__ == '__main__':
    app.run(debug=True)
