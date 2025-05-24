const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const path = require('path');

require('dotenv').config();
const apiKey = process.env.API_KEY;
if (!apiKey) {
  console.error('Error: GROQ_API_KEY is not defined in .env file');
  process.exit(1);
}

const app = express();
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// Serve static files from the root frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

// Redirect root URL to index.html
app.get('/', (req, res) => {
  res.redirect('/pages/index.html');
});


app.post('/api/recommendations', async (req, res) => {
  const { temperature, heartRate, bloodPressure, bloodSugar, meals, exercises } = req.body;

const prompt = `
Analyze the following health data for an individual:
- Temperature: ${temperature} °C (normal range: 36.1–37.2 °C)
- Heart Rate: ${heartRate} bpm (normal range: 60–100 bpm at rest)
- Blood Pressure: ${bloodPressure} mmHg (normal range: 90/60–120/80 mmHg)
- Blood Sugar: ${bloodSugar} mg/dL (normal fasting range: 70–99 mg/dL)
- Meals: ${meals} (details on type, frequency, portion size, or specific foods, if provided)
- Exercises: ${exercises} (details on type, duration, frequency, or intensity, if provided)

Generate a detailed, well-formatted report with the following sections, using concise bullet points and clear headings. Ensure all analyses and recommendations are specific to the provided input values or descriptions, avoiding generic advice.

---

#### Metric Analysis
For each metric, analyze the specific input value:
- **Temperature (${temperature} °C)**: State if it is normal, high, or low compared to 36.1–37.2 °C. Explain potential implications (e.g., fever, hypothermia) in 1–2 sentences.
- **Heart Rate (${heartRate} bpm)**: State if it is normal, high, or low compared to 60–100 bpm at rest. Describe possible causes or risks (e.g., stress, cardiovascular issues) in 1–2 sentences.
- **Blood Pressure (${bloodPressure} mmHg)**: State if systolic/diastolic values are normal, high, or low compared to 90/60–120/80 mmHg. Outline health implications (e.g., hypertension, hypotension) in 1–2 sentences.
- **Blood Sugar (${bloodSugar} mg/dL)**: State if it is normal, high, or low compared to 70–99 mg/dL (fasting). Note potential concerns (e.g., diabetes risk, hypoglycemia) in 1–2 sentences.
- If any metric is missing or invalid, state this and provide general guidance for monitoring that metric.
- For borderline values, recommend monitoring or mild interventions.
- For critical values (e.g., blood pressure >180/120 mmHg, blood sugar >250 mg/dL), include a bolded warning: **Consult a healthcare professional immediately**.

#### Dietary Recommendations
Based on the specific meals (${meals}) and health metrics:
- Suggest 2–3 foods to add, tailored to the meal details and any abnormal metrics. For each:
  - Specify the food and a typical portion size (e.g., "1 cup cooked quinoa").
  - Describe a simple preparation method (e.g., "boiled with low-sodium broth").
  - Explain the specific benefit tied to the health data (e.g., "rich in magnesium to lower blood pressure").
- Suggest 2–3 foods to avoid, based on the meal description and health data. For each:
  - Specify the food and why it should be avoided (e.g., "sugary drinks increase blood sugar").
  - Suggest a healthier alternative (e.g., "replace with sparkling water").
- If meal data is vague or missing, use the health metrics to suggest a balanced diet addressing any abnormalities, with portion sizes and preparation details.

#### Exercise Recommendations
Based on the specific exercises (${exercises}) and health metrics:
- Recommend 2–3 exercises to complement or improve the current routine, tailored to the provided type, duration, frequency, or intensity. For each:
  - Specify the exercise type (e.g., cardio, strength, flexibility) and a specific movement (e.g., "brisk walking", "bodyweight squats").
  - Provide duration (e.g., "20 minutes"), frequency (e.g., "3 times/week"), and intensity (e.g., "moderate, able to talk but not sing").
  - Explain the benefit tied to the health data (e.g., "improves cardiovascular health for high blood pressure").
- If exercise data is missing or vague, suggest a beginner-friendly routine aligned with the health metrics, including specific movements, duration, frequency, and intensity.
- Ensure exercises are safe and feasible for the individual’s health profile.

#### Lifestyle Changes
For long-term health, based on the specific health data:
- Provide 4–5 actionable lifestyle changes directly addressing the input metrics or meal/exercise patterns (e.g., reduce screen time for high heart rate, improve hydration for blood pressure).
- Ensure each suggestion is practical, specific, feasible, and tailored to the individual’s data, with a brief explanation of its benefit (e.g., "Limit caffeine to reduce heart rate variability").

#### Disclaimer
- This report is generated by an AI and is for informational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider for personalized health guidance, especially for critical or abnormal values.

---

**Additional Instructions**:
- Use clear, non-technical language suitable for a general audience.
- Format the response with consistent headings, bullet points, and spacing for readability.
- Tie every recommendation to the specific input values or descriptions provided.
- If data is incomplete, acknowledge it and base suggestions on available metrics.
- Ensure critical health warnings are bolded and prominent.
- Avoid assumptions beyond the provided data; do not invent health conditions or details.
`;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 500
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Groq API request failed: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const recommendations = data.choices[0].message.content.trim();
    res.json({ recommendations });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: `Failed to fetch recommendations: ${error.message}` });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));