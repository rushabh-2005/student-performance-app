import mysql.connector
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
import joblib # Used to save the model

def train_student_ai():
    try:
        # 1. Connect to your MySQL Database
        db = mysql.connector.connect(
            host="localhost",
            user="root",
            password="",
            database="student_analysis" # Change to your actual DB name
        )

        # 2. Fetch Historical Data 
        # We join results with attendance and monitoring logs
        query = """
            SELECT 
                r.subject_1 as external_marks,
                i.subject_1 as internal_marks,
                a.attended_lectures / a.total_lectures * 100 as attendance_per,
                AVG(m.study_hours) as avg_study_hours
            FROM results r
            JOIN internal_results i ON r.user_id = i.user_id
            JOIN attendance_logs a ON r.user_id = a.user_id
            JOIN monitoring_logs m ON r.user_id = m.user_id
            GROUP BY r.id
        """
        
        df = pd.read_sql(query, db)
        db.close()

        if df.empty:
            print("No data found to train. Add some records first!")
            return

        # 3. Define Features (X) and Target (y)
        X = df[['internal_marks', 'attendance_per', 'avg_study_hours']]
        y = df['external_marks']

        # 4. Train the Model
        model = LinearRegression()
        model.fit(X, y)

        # 5. Save the 'Brain' to a file
        joblib.dump(model, 'student_model.pkl')
        print("Success: AI Model trained and saved as student_model.pkl")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    train_student_ai()