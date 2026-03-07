import pandas as pd
import numpy as np
import random
import os

def generate_past_student_data(num_records=800):
    # Set seed for reproducibility (so we get the same random data every time we run it)
    np.random.seed(42)
    random.seed(42)
    
    first_names = ["Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Sai", "Riya", "Aanya", "Diya", "Ananya", "Isha", "Rohan", "Rahul", "Karan", "Priya", "Neha", "Sneha", "Amit", "Sumit", "Aditi", "Kavya", "Mohammad", "Farid", "Komal", "Rushabh", "Jignesh"]
    last_names = ["Sharma", "Patel", "Singh", "Kumar", "Gupta", "Deshmukh", "Joshi", "Chawla", "Bose", "Verma", "Reddy", "Nair", "Das", "Yadav", "Shah", "Kansara", "Kapadia"]
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
    
    data = []
    
    for i in range(1, num_records + 1):
        user_id = i
        name = f"{random.choice(first_names)} {random.choice(last_names)}"
        pass_out_year = random.randint(2018, 2025)
        subject = random.choice(subjects)
        
        # 1. Generate Realistic Features (Inputs)
        # Attendance between 50% and 100%
        attendance_percentage = round(np.random.uniform(50.0, 100.0), 2)
        
        # Internal marks out of 100
        internal_marks = round(np.random.uniform(30.0, 100.0), 2)
        
        # Students with fewer marks or attendance might take more extra tutoring (in hours)
        if internal_marks < 60 or attendance_percentage < 70:
            extra_tutoring_sessions = random.randint(15, 50)
        else:
            extra_tutoring_sessions = random.randint(0, 20)
            
        # 2. Generate the Target (Output)
        # We need a hidden mathematical formula so the AI has something real to learn.
        # Let's say: 50% weight to internal, 40% to attendance, and some boost from extra tutoring
        base_score = (internal_marks * 0.5) + (attendance_percentage * 0.4) + (extra_tutoring_sessions * 0.2)
        
        # Add some random noise (real life isn't perfectly predictable)
        noise = np.random.normal(0, 5) # mean 0, variance 5
        final_external_marks = round(base_score + noise, 2)
        
        # Make sure final marks stay logically between 0 and 100
        final_external_marks = max(0.0, min(100.0, final_external_marks))
        
        # Add row to our data list
        data.append({
            "user_id": user_id,
            "name": name,
            "pass_out_year": pass_out_year,
            "subject": subject,
            "internal_marks": internal_marks,
            "attendance_percentage": attendance_percentage,
            "extra_tutoring_sessions": extra_tutoring_sessions,
            "final_external_marks": final_external_marks
        })
        
    # Convert our list of dictionaries into a Pandas DataFrame
    df = pd.DataFrame(data)
    
    # Save to a .csv file in the same directory
    csv_filename = "previous_std_Data.csv"
    csv_path = os.path.join(os.path.dirname(__file__), csv_filename)
    try:
        df.to_csv(csv_path, index=False)
        print(f"Success! Generated synthetic dataset with {num_records} records.")
        print(f"Data saved to CSV: {csv_path}")
    except PermissionError:
        csv_filename = "previous_std_Data_new.csv"
        csv_path = os.path.join(os.path.dirname(__file__), csv_filename)
        df.to_csv(csv_path, index=False)
        print(f"Success! Generated synthetic dataset with {num_records} records.")
        print(f"Note: Original file was open, so data saved to CSV: {csv_path}")
    
    # Attempt to insert directly into database
    try:
        import mysql.connector
        db = mysql.connector.connect(
            host="localhost",
            user="root",
            password="",
            database="student_analysis"
        )
        cursor = db.cursor()
        
        # Clear existing data so we don't duplicate 800 rows every time we run the script
        cursor.execute("TRUNCATE TABLE previous_std_Data")
        
        insert_query = """
            INSERT INTO previous_std_Data (
                user_id, name, pass_out_year, subject, internal_marks, 
                attendance_percentage, extra_tutoring_sessions, final_external_marks
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """
        
        values_list = []
        for index, row in df.iterrows():
            values_list.append((
                row['user_id'], row['name'], row['pass_out_year'], row['subject'], 
                row['internal_marks'], row['attendance_percentage'], 
                row['extra_tutoring_sessions'], row['final_external_marks']
            ))
            
        cursor.executemany(insert_query, values_list)
        db.commit()
        db.close()
        print(f"Success! {num_records} records inserted into MySQL 'previous_std_Data' table.")
        
    except Exception as e:
        print(f"Data was saved to CSV, but could not insert into MySQL database. Error: {e}")
        
    print("\nPreview of the data:")
    print(df.head())

if __name__ == "__main__":
    generate_past_student_data(800)
