VirtualMind
Overview
VirtualMind is a sophisticated web-based platform designed to deliver personalized mentoring for physical and mental well-being. Powered by cutting-edge AI technologies, the application analyzes comprehensive health metrics and emotional data to provide tailored recommendations and insights, enhancing user health outcomes.
Key Features

Physical Mentoring: Integrates a state-of-the-art API from Groq, featuring an LLMA model, to evaluate temperature, blood pressure, heart rate, blood sugar levels, daily exercise routines, and dietary habits, offering precise and actionable health advice.
Mental Mentoring: Employs a proprietary logistic regression model to analyze daily diary entries, enabling accurate emotion detection and longitudinal mood tracking for improved mental health awareness.

Technical Stack

Front-end: HTML, CSS
Back-end: Node.js
Model Development: Python (logistic regression)

Prerequisites

Node.js (latest stable release)
Python 3.x (recommended version 3.9 or higher)

Installation and Setup

Clone the Repository:
git clone https://github.com/MeN1na/VirtualMind.git
cd VirtualMind


Install Backend Dependencies:

Navigate to the backend directory:cd backend
npm install




Configure Python Environment:

Create a virtual environment:python -m venv venv


Activate the virtual environment:
Windows: venv\Scripts\activate
Unix/MacOS: source venv/bin/activate


Install required Python packages from requirements.txt.


Launch the Application:

Initiate the Node.js server:node server.js


Start the Python server:python server.py


Access the application via http://localhost:3000 


Project Team

Amira Salah 
Raghad Hassona 
Rodina Hamza 
Menna Selim 

Licensing
This project is distributed under the MIT License. For full terms, refer to the LICENSE file.

Last Updated
May 24, 2025
