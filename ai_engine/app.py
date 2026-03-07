import joblib
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/predict": {"origins": "http://localhost:5173"}})  # This allows React to talk to Python safely

# Load the trained AI model
model = joblib.load('student_model.pkl')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        internal = float(data.get('internal_marks', 0))
        attendance = float(data.get('attendance_per', 0))
        # The frontend might send study_hours or extra_tutoring_sessions
        current_study = float(data.get('study_hours', data.get('extra_tutoring_sessions', 0)))

        # 1. Get the current prediction
        # Ensure input maps to what model was trained on: internal_marks, attendance_percentage, extra_tutoring_sessions
        features = [[internal, attendance, current_study]]
        prediction = model.predict(features)[0]
        
        # 2. Make sure score logically stays between 0 and 100
        final_score = round(max(0.0, min(100.0, float(prediction))), 2)

        # 3. Grade Calculation Logic
        if final_score >= 80:
            grade = 'A'
            category = 'Topper'
        elif final_score >= 50:
            grade = 'B'
            category = 'Average'
        else:
            grade = 'C'
            category = 'Below Average'

        # 4. Prescription Logic (The "What-If" Analysis)
        recommendation = ""
        if final_score < 50:
            # Simulate increasing study hours until the score is >= 50 (passing criteria based on grade B)
            sim_study = current_study
            while sim_study < 15: # Limit simulation to 15 hours
                sim_study += 0.5
                sim_pred = model.predict([[internal, attendance, sim_study]])[0]
                if sim_pred >= 50:
                    needed = round(sim_study - current_study, 1)
                    recommendation = f"AI Insight: Increasing your study/tutoring by {needed} hours/sessions could push you to a B Grade."
                    break
            if not recommendation:
                recommendation = "You are at high risk of a poor grade. Please consult your instructors immediately."
        else:
            recommendation = "You are currently in a good zone. Maintain your consistency!"

        return jsonify({
            "predicted_score": final_score,
            "grade": grade,
            "category": category,
            "advice": recommendation
        })
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    # Python runs on Port 5000 by default
    app.run(debug=True, port=5000)
