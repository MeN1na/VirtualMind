import sqlite3
import pytz
from datetime import datetime

DB_PATH = r"D:\VirtualMind\data (2).db"

conn = sqlite3.connect(DB_PATH, check_same_thread=False)
c = conn.cursor()

IST = pytz.timezone('Asia/Kolkata') 
def create_page_visited_table():
    c.execute('CREATE TABLE IF NOT EXISTS pageTrackTable(pagename TEXT, timeOfvisit TIMESTAMP)')

def add_page_visited_details(pagename, timeOfvisit=None):
    if timeOfvisit is None:
        timeOfvisit = datetime.now(IST).strftime("%Y-%m-%d %H:%M:%S")
    else:
        timeOfvisit = timeOfvisit.astimezone(IST).strftime("%Y-%m-%d %H:%M:%S")
    c.execute('INSERT INTO pageTrackTable(pagename, timeOfvisit) VALUES (?, ?)', (pagename, timeOfvisit))
    conn.commit()

def view_all_page_visited_details():
    c.execute('SELECT * FROM pageTrackTable')
    data = c.fetchall()
    return data

def create_emotionclf_table():
    c.execute('CREATE TABLE IF NOT EXISTS emotionclfTable(rawtext TEXT, prediction TEXT, probability NUMBER, timeOfvisit TIMESTAMP)')

def add_prediction_details(rawtext, prediction, probability, timeOfvisit=None):
    if timeOfvisit is None:
        timeOfvisit = datetime.now(IST).strftime("%Y-%m-%d %H:%M:%S")
    else:
        timeOfvisit = timeOfvisit.astimezone(IST).strftime("%Y-%m-%d %H:%M:%S")
    c.execute('INSERT INTO emotionclfTable(rawtext, prediction, probability, timeOfvisit) VALUES (?, ?, ?, ?)', (rawtext, prediction, probability, timeOfvisit))
    conn.commit()

def view_all_prediction_details():
    c.execute('SELECT * FROM emotionclfTable')
    data = c.fetchall()
    return data
