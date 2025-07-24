document.getElementById('calculatorForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const weight = parseFloat(document.getElementById('weight').value);
  const height = parseFloat(document.getElementById('height').value) / 100;
  const MET = parseFloat(document.getElementById('activity').value);
  const duration = parseFloat(document.getElementById('duration').value) / 60;

  const calories = MET * weight * duration;
  const weightLoss = calories / 7700;
  const newWeight = weight - weightLoss;
  const oldBMI = weight / (height * height);
  const newBMI = newWeight / (height * height);

  document.getElementById('results').innerHTML = `
    <p>Calories Burned: <strong>${calories.toFixed(2)}</strong> kcal</p>
    <p>Estimated Weight Loss: <strong>${weightLoss.toFixed(2)}</strong> kg</p>
    <p>BMI: <strong>${oldBMI.toFixed(2)}</strong> → <strong>${newBMI.toFixed(2)}</strong></p>
  `;
});