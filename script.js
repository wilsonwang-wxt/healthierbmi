document.getElementById('calculatorForm').addEventListener('submit', function(e) {
  e.preventDefault();

  // Inputs
  const weight = parseFloat(document.getElementById('weight').value);
  const heightCm = parseFloat(document.getElementById('height').value);
  const MET = parseFloat(document.getElementById('activity').value);
  const durationPerTrip = parseFloat(document.getElementById('duration').value);
  const daysPerWeek = parseFloat(document.getElementById('days').value);

  // 1. Calculate Net Calories (MET - 1 used to calculate EXTRA burn over resting)
  // Formula: (MET - 1) * 0.0175 * weight * minutes
  const dailyExtraCalories = (MET - 1) * 0.0175 * weight * (durationPerTrip * 2);
  
  // 2. Monthly Projection (Avg 4.33 weeks per month)
  const monthlyCalories = dailyExtraCalories * daysPerWeek * 4.33;
  
  // 3. Weight Loss (7700 kcal = 1kg)
  const monthlyWeightLoss = monthlyCalories / 7700;
  const newWeight = weight - monthlyWeightLoss;

  // 4. BMI Calculations
  const heightM = heightCm / 100;
  const oldBMI = weight / (heightM * heightM);
  const newBMI = newWeight / (heightM * heightM);

  // UI Updates
  document.getElementById('results').classList.remove('hidden');
  document.getElementById('calOut').innerText = Math.round(monthlyCalories).toLocaleString();
  document.getElementById('weightOut').innerText = monthlyWeightLoss.toFixed(2);
  document.getElementById('oldBMI').innerText = oldBMI.toFixed(1);
  document.getElementById('newBMI').innerText = newBMI.toFixed(1);

  // Visual Bar: Assume a BMI of 30 is "Full" for visualization purposes
  const barWidth = Math.min((newBMI / 35) * 100, 100);
  document.getElementById('bmiBar').style.width = barWidth + '%';

  // Logic for insight
  let insight = "Keep it up! Constant movement is key.";
  if (newBMI < oldBMI) {
    insight = `By commuting actively, you'll burn the equivalent of ${Math.round(monthlyCalories / 250)} chocolate bars every month!`;
  }
  document.getElementById('insight').innerText = insight;
});    
    return { kgLostPerMonth, newBMI, monthlyDeficit };
}
