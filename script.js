// Function to add new journey legs
function addLeg(containerId) {
    const container = document.getElementById(containerId);
    const newRow = document.createElement('div');
    newRow.className = 'leg-row';
    newRow.innerHTML = `
        <select class="leg-activity">
            <option value="3.5">Walking (Brisk)</option>
            <option value="6.8">Cycling</option>
            <option value="3.0">E-Bike</option>
            <option value="1.5">Public Transport</option>
        </select>
        <input type="number" class="leg-duration" placeholder="Mins">
        <button type="button" class="remove-btn" onclick="this.parentElement.remove()">✕</button>
    `;
    container.appendChild(newRow);
}

// Toggle Return Journey Section
function toggleReturn() {
    const isSame = document.getElementById('sameReturn').checked;
    const returnSection = document.getElementById('returnSection');
    isSame ? returnSection.classList.add('hidden') : returnSection.classList.remove('hidden');
}

// Methodology Toggle
document.getElementById('toggleMethod').addEventListener('click', () => {
    document.getElementById('methodology').classList.toggle('hidden');
});

// Main Calculation
document.getElementById('calcBtn').addEventListener('click', function() {
    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value);
    const age = parseInt(document.getElementById('age').value);
    const days = parseInt(document.getElementById('days').value);
    const isSameReturn = document.getElementById('sameReturn').checked;

    if (!weight || !height) return alert("Please enter weight and height.");

    // Function to sum calories from a container
    function getCalories(containerId) {
        let total = 0;
        const rows = document.getElementById(containerId).querySelectorAll('.leg-row');
        rows.forEach(row => {
            const met = parseFloat(row.querySelector('.leg-activity').value);
            const mins = parseFloat(row.querySelector('.leg-duration').value) || 0;
            total += (met - 1) * 0.0175 * weight * mins;
        });
        return total;
    }

    const outwardCals = getCalories('outward-legs');
    const returnCals = isSameReturn ? outwardCals : getCalories('return-legs');
    
    const dailyTotal = outwardCals + returnCals;
    const monthlyBurn = dailyTotal * days * 4.33;
    const kgLost = monthlyBurn / 7700;

    const heightM = height / 100;
    const currentBMI = weight / (heightM * heightM);
    const projectedBMI = (weight - kgLost) / (heightM * heightM);

    // Update UI
    document.getElementById('results').classList.remove('hidden');
    document.getElementById('calOut').innerText = Math.round(monthlyBurn).toLocaleString();
    document.getElementById('weightOut').innerText = kgLost.toFixed(2);
    document.getElementById('newBMI').innerText = projectedBMI.toFixed(1);

    // Progress Bar (Green if losing weight)
    const barWidth = Math.min((projectedBMI / 35) * 100, 100);
    document.getElementById('bmiBar').style.width = barWidth + '%';

    // Fun Fact (Pizza)
    const slices = Math.floor(monthlyBurn / 250);
    document.getElementById('insight').innerText = `Fun Fact: Your commute burns the equivalent of ${slices} slices of pizza per month!`;

    // National Average Logic (Based on your HSE 2024 data)
    let ageAvg = 27.8; // Default
    if (age <= 24) ageAvg = 25.0;
    else if (age >= 55 && age <= 64) ageAvg = 28.7;
    else if (age > 24 && age < 55) ageAvg = 27.2; // Interpolated
    
    document.getElementById('ageAvg').innerText = ageAvg.toFixed(1);
    
    const diff = projectedBMI - ageAvg;
    const compareText = diff > 0 
        ? `Your BMI is ${Math.abs(diff).toFixed(1)} points ABOVE the average for your age.`
        : `Your BMI is ${Math.abs(diff).toFixed(1)} points BELOW the average for your age.`;
    document.getElementById('bmiCompareText').innerText = compareText;

    document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
});
