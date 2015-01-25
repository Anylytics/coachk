import sqlite3
from flask import Flask, render_template, abort, request, jsonify, g

DATABASE = '/Users/gokuls/Projects/coachk-backend/coachk.db'

app = Flask(__name__)

def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = connect_db()
    return db

@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

def connect_db():
    return sqlite3.connect(DATABASE)

@app.route('/')
def home_page():
    return render_template('index.html')

@app.route('/data')
def data():
    band = []
    count = []
    c = get_db().cursor()
    for row in c.execute('SELECT * FROM (SELECT * from aggbins order by bin DESC limit 20) T1 order by bin ASC;'):
        band.append( row[0] )
        count.append( row[1] )
    return jsonify(band = band, counts = count);

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000, debug='True')