// Function to add a new leg to the commute
document.getElementById('addLegBtn').addEventListener('click', function() {
  const container = document.getElementById('legs-container');
  const newRow = document.createElement('div');
  newRow.className = 'leg-row';
  newRow.innerHTML = `
    <select class="leg-activity">
      <option value="3.5">Walking (Brisk)</option>
      <option value="6.8">Cycling</option>
      <option value="3.0">E-Bike</option>
      <option value="1.5">Public Transport (Standing/Walking)</option>
      <option value="1.3">Driving/Sitting</option>
    </select>
    <input type="number" class="leg-duration" placeholder="Mins">
    <button type="button" class="remove-btn" onclick="this.parentElement.remove()">✕</button>
  `;
  container.appendChild(newRow);
});

// Main Calculation Logic
document.getElementById('calcBtn').addEventListener('click', function() {
  const weight = parseFloat(document.getElementById('weight').value);
  const heightCm = parseFloat(document.getElementById('height').value);
  const daysPerWeek = parseFloat(document.getElementById('days').value);
  
  if (!weight || !heightCm) {
    alert("Please enter weight and height");
    return;
  }

  let totalDailyExtraCalories = 0;

  // Loop through every leg row
  const activities = document.querySelectorAll('.leg-activity');
  const durations = document.querySelectorAll('.leg-duration');

  activities.forEach((activity, index) => {
    const met = parseFloat(activity.value);
    const mins = parseFloat(durations[index].value) || 0;
    
    // Net Calories = (MET - 1) * 0.0175 * weight * duration
    // We assume round trip, so multiply mins by 2
    const extraBurn = (met - 1) * 0.0175 * weight * (mins * 2);
    totalDailyExtraCalories += extraBurn;
  });

  // Monthly Projection (4.33 weeks per month)
  const monthlyBurn = totalDailyExtraCalories * daysPerWeek * 4.33;
  const monthlyWeightLoss = monthlyBurn / 7700; // 7700 kcal = 1kg

  // BMI Calculation
  const heightM = heightCm / 100;
  const oldBMI = weight / (heightM * heightM);
  const newBMI = (weight - monthlyWeightLoss) / (heightM * heightM);

  // Update UI
  const resultsDiv = document.getElementById('results');
  resultsDiv.classList.remove('hidden');
  
  document.getElementById('calOut').innerText = Math.round(monthlyBurn).toLocaleString();
  document.getElementById('weightOut').innerText = monthlyWeightLoss.toFixed(2);
  document.getElementById('oldBMI').innerText = oldBMI.toFixed(1);
  document.getElementById('newBMI').innerText = newBMI.toFixed(1);

  // Animate Progress Bar (Normalized to BMI 35)
  const barWidth = Math.min((newBMI / 35) * 100, 100);
  document.getElementById('bmiBar').style.width = barWidth + '%';

  // Insights
  const pizzaEquiv = Math.floor(monthlyBurn / 250);
  document.getElementById('insight').innerText = `That's equivalent to burning off ${pizzaEquiv} slices of pizza every month just by commuting!`;
  
  // Scroll to results
  resultsDiv.scrollIntoView({ behavior: 'smooth' });
});
