import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score
import joblib
import os

def train_and_get_model():
    base_dir = os.path.dirname(__file__)
    model_path = os.path.join(base_dir, 'student_model.pkl')
    
    # Check if the CSV exists
    csv_path = os.path.join(base_dir, 'previous_std_Data.csv')
    if not os.path.exists(csv_path):
        # Fallback to the new one if the permission error happened before
        csv_path = os.path.join(base_dir, 'previous_std_Data_new.csv')
        
    if not os.path.exists(csv_path):
        print("Error: Could not find the past records CSV file.")
        return None

    print("Loading historical data and training the AI model on the fly...")
    df = pd.read_csv(csv_path)
    
    # Features (X) and Target (y)
    X = df[['internal_marks', 'attendance_percentage', 'extra_tutoring_sessions']]
    y = df['final_external_marks']
    
    # Split the testing data so we can evaluate how good the AI is
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    model = LinearRegression()
    model.fit(X_train, y_train)
    
    # Evaluate the model
    y_pred = model.predict(X_test)
    mae = mean_absolute_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)
    
    print("\n" + "-"*40)
    print("   AI MODEL ACCURACY EVALUATION   ")
    print("-" * 40)
    print(f"Mean Absolute Error (MAE): {mae:.2f}")
    print(f"R-Squared Score (R2): {r2:.2f} ({(r2*100):.1f}% Accuracy)")
    print("-"*40 + "\n")
    
    # Save the model
    joblib.dump(model, model_path)
    print("[SUCCESS] Model trained successfully!")
    return model

def calculate_grade(score):
    if score >= 80:
        return 'A', 'Topper'
    elif score >= 50:
        return 'B', 'Average'
    else:
        return 'C', 'Below Average'

def predict_student_performance():
    base_dir = os.path.dirname(__file__)
    model_path = os.path.join(base_dir, 'student_model.pkl')
    
    if os.path.exists(model_path):
        model = joblib.load(model_path)
    else:
        model = train_and_get_model()
        
    if not model:
        return
        
    print("\n" + "="*50)
    print("   STUDENT EXAM SCORE PREDICTOR AI   ")
    print("="*50)
    
    subjects = [
        "cppm", 
        "dbms", 
        "maths", 
        "Introduction to computer", 
        "Communication Skills", 
        "Programming skill in python", 
        "Relational Database management system",
        "Introduction to operating system",
        "Introduction to HTML 5",
        "Business studies",
        "Introduction to Object Oriented Programming in cpp",
        "Database Handling Using Python",
        "Introduction to Web Design"
    ]
    
    print("\nAvailable Subjects:")
    for i, sub in enumerate(subjects, 1):
        print(f"{i}. {sub}")
        
    try:
        sub_idx = int(input("\nSelect a subject (Enter number 1-13): ")) - 1
        if sub_idx < 0 or sub_idx >= len(subjects):
            print("Invalid choice. Selecting Default Subject.")
            selected_subject = subjects[0]
        else:
            selected_subject = subjects[sub_idx]
        
        internal = float(input("\nEnter Internal Marks (out of 100): "))
        attendance = float(input("Enter Attendance Percentage (0-100): "))
        tutoring = int(input("Enter Study Hours / Extra Tutoring Sessions: "))
        
        # Predict using the model
        # We need to pass the data in the same format it was trained on
        input_data = pd.DataFrame({
            'internal_marks': [internal],
            'attendance_percentage': [attendance],
            'extra_tutoring_sessions': [tutoring]
        })
        
        predicted_score = model.predict(input_data)[0]
        
        # Make sure score logically stays between 0 and 100
        predicted_score = max(0.0, min(100.0, predicted_score))
        
        grade, category = calculate_grade(predicted_score)
        
        print("\n" + "*"*45)
        print("          AI PREDICTION RESULTS          ")
        print("*"*45)
        print(f"Subject         : {selected_subject}")
        print(f"Predicted Score : {predicted_score:.2f} / 100")
        print(f"Estimated Grade : {grade}")
        print(f"Student Category: {category}")
        print("*"*45 + "\n")
        
    except ValueError:
        print("\n[ERROR] Invalid input! Please enter numeric values only.")
    except Exception as e:
        print(f"\n[ERROR] {e}")

if __name__ == "__main__":
    # Force train mode argument could be added, but for now we just predict
    import sys
    if len(sys.argv) > 1 and sys.argv[1] == '--train':
        train_and_get_model()
    else:
        predict_student_performance()
