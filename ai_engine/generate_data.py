import mysql.connector
import random

def seed_database():
    try:
        db = mysql.connector.connect(
            host="localhost",
            user="root",
            password="",
            database="your_database_name"
        )
        cursor = db.cursor()

        # 1. Get existing student IDs
        cursor.execute("SELECT id FROM users")
        student_ids = [row[0] for row in cursor.fetchall()]

        if not student_ids:
            print("No students found in 'users' table. Please register some students first.")
            return

        for s_id in student_ids:
            # We will generate data for 5 subjects for each student
            attendance_per = random.randint(60, 100)
            avg_study = random.uniform(1.0, 6.0)

            # --- Internal Marks (out of 30) ---
            # Logic: Higher attendance/study usually leads to higher marks
            internal = int((attendance_per * 0.2) + (avg_study * 3) + random.randint(0, 5))
            internal = min(internal, 30)

            # --- External Marks (out of 70) ---
            # Logic: Correlate with internal + some randomness
            external = int((internal * 1.5) + (attendance_per * 0.1) + (avg_study * 2) + random.randint(-5, 5))
            external = max(0, min(external, 70))

            # 2. Insert into internal_results
            cursor.execute("""
                INSERT INTO internal_results (user_id, semester, subject_1, total_internal)
                VALUES (%s, 'Sem 1', %s, %s)
            """, (s_id, internal, internal))

            # 3. Insert into results (Finals)
            cursor.execute("""
                INSERT INTO results (user_id, semester, subject_1, total_marks)
                VALUES (%s, 'Sem 1', %s, %s)
            """, (s_id, external, external))

            # 4. Insert into monitoring_logs (Study Hours)
            cursor.execute("""
                INSERT INTO monitoring_logs (user_id, subject_id, semester, study_hours, log_date)
                VALUES (%s, 1, 'Sem 1', %s, '2026-03-01')
            """, (s_id, avg_study))

        db.commit()
        print(f"Successfully generated data for {len(student_ids)} students!")
        db.close()

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    seed_database()