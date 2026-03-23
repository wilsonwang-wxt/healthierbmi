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
const METS = { walking: 3.5, cycling: 6.8, transit: 1.5 };

function calculateResults(user) {
    // 1. Calculate Daily Extra Burn
    const dailyExtra = (METS[user.mode] - 1) * 0.0175 * user.weight * (user.duration * 2);
    
    // 2. Project Monthly (5 days/week)
    const monthlyDeficit = dailyExtra * 5 * 4.33;
    
    // 3. Weight loss (7700 kcal = 1kg)
    const kgLostPerMonth = monthlyDeficit / 7700;
    
    // 4. Update BMI after 1 month
    const newWeight = user.weight - kgLostPerMonth;
    const heightInMeters = user.height / 100;
    const newBMI = newWeight / (heightInMeters * heightInMeters);
    
    return { kgLostPerMonth, newBMI, monthlyDeficit };
}
