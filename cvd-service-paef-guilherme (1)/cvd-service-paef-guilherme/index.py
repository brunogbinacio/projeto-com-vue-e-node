# src/index.py

import os
from flask import Flask, request, render_template
from src.service.customer_csv_upload import handle_upload
from src.temp.result import Result

template_dir = os.path.abspath('src/assets/screen')
static_dir = os.path.abspath('src/assets')

app = Flask(__name__, template_folder=template_dir, static_folder=static_dir)


@app.route('/')
def home():
    return render_template('upload.html')

@app.route('/customer/upload', methods=['POST'])
async def upload_customer():
    return await Result.handle_request(request, app.response_class(), handle_upload)

def main():
    app.run(debug=True, host="0.0.0.0", port=5000)

if __name__ == '__main__':
    main()
