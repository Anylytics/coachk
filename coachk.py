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
    for row in c.execute('SELECT * FROM (SELECT * from aggbins order by bin DESC limit 10) T1 order by bin ASC;'):
        band.append( row[0] )
        count.append( row[1] )
    return jsonify(band = band, counts = count)

@app.route('/tweets/<timebin>')
def tweets(timebin):
    tweets = []
    ids = []
    c = get_db().cursor()
    for row in c.execute('SELECT * FROM timebins where bin=?',[timebin]):
        ids.append( row[1] )
    for id in ids:
        for row in c.execute('SELECT * FROM tweets where tweet_id=?',[id]):
            tweet = row[3]
            dttm = row[2]
            user_id = row[1]
            for user in c.execute('SELECT * FROM users where user_id=?',[user_id]):
                username = user[1]
                pic = user[2]
                handle = user[3]
                tweets.append({"tweet":tweet, "dttm": dttm, "username":username, "pic":pic, "user_id":handle})
    return jsonify(tweets = tweets)

@app.route('/score')
def score():
    c = get_db().cursor()
    duke = 0
    stj = 0
    for row in c.execute('SELECT duke, stj FROM score WHERE rowid = (SELECT max(rowid) FROM score)'):
        duke = row[0]
        stj = row[1]
    return jsonify(duke = duke, stj = stj)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000, debug='True')