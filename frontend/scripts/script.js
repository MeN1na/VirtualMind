document.addEventListener('DOMContentLoaded', () => {
  const recommendationsDiv = document.getElementById('recommendations');
  if (recommendationsDiv) {
    recommendationsDiv.innerText = ''; // Clear any previous messages
  }
});

document.getElementById('healthForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const healthData = {
    temperature: document.getElementById('temperature').value.trim(),
    heartRate: document.getElementById('heartRate').value.trim(),
    bloodPressure: document.getElementById('bloodPressure').value.trim(),
    bloodSugar: document.getElementById('bloodSugar').value.trim(),
    meals: document.getElementById('meals').value.trim(),
    exercises: document.getElementById('exercises').value.trim()
  };

  // Validate that all fields are filled
  if (!healthData.temperature || !healthData.heartRate || !healthData.bloodPressure || 
      !healthData.bloodSugar || !healthData.meals || !healthData.exercises) {
    alert('Please fill in all fields');
    return;
  }

  // Validate blood pressure format
  const bp = healthData.bloodPressure;
  if (!/^\d{2,3}\/\d{2,3}$/.test(bp)) {
    alert('Blood Pressure must be in format like 120/80');
    return;
  }

  const recommendationsDiv = document.getElementById('recommendations');
  if (recommendationsDiv) {
    recommendationsDiv.innerText = 'Loading recommendations...';
  }

  try {
    console.log('Sending data:', healthData); // Debug log
    
    const response = await fetch('http://localhost:3000/api/recommendations', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(healthData)
    });

    console.log('Response status:', response.status); // Debug log

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Received data:', data); // Debug log

    if (data.recommendations) {
      // Store recommendations in sessionStorage
      sessionStorage.setItem('recommendations', data.recommendations);
      
      // Clear the form
      document.getElementById('healthForm').reset();
      
      // Redirect to recommendations page
      window.location.href = 'recommendation.html';
    } else {
      throw new Error('No recommendations received from server');
    }

  } catch (error) {
    console.error('Error:', error);
    if (recommendationsDiv) {
      recommendationsDiv.innerHTML = `
        <div style="color: red; padding: 10px; background: #fee; border: 1px solid #fcc; border-radius: 4px;">
          <strong>Error:</strong> ${error.message}
          <br><small>Please check the console for more details and ensure the server is running.</small>
        </div>
      `;
    }
  }
});