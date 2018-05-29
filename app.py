from flask import Flask
app = Flask(__name__)
server_ip = '137.74.172.99'

@app.route("/")
def index():
    return 'Perfect! ok2!'

if __name__ == "__main__":
    app.run(debug=True)