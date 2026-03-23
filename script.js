function addLeg(containerId) {
    const container = document.getElementById(containerId);
    const div = document.createElement('div');
    div.className = 'leg-item';
    div.innerHTML = `
        <select class="leg-activity">
            <option value="3.5">Walking (Brisk)</option>
            <option value="6.8">Cycling</option>
            <option value="3.0">E-Bike</option>
            <option value="1.5">Public Transport</option>
        </select>
        <input type="number" class="leg-duration" value="15">
        <button onclick="this.parentElement.remove()" style="border:none; background:none; cursor:pointer;">✕</button>
    `;
    container.appendChild(div);
}

function toggleReturn() {
    const isSame = document.getElementById('sameReturn').checked;
    document.getElementById('returnSection').classList.toggle('hidden', isSame);
}

document.getElementById('calcBtn').addEventListener('click', function() {
    const weight = parseFloat(document.getElementById('weight').value);
    const heightCm = parseFloat(document.getElementById('height').value);
    const days = parseInt(document.getElementById('days').value);
    const isSameReturn = document.getElementById('sameReturn').checked;

    if (!weight || !heightCm) return alert("Please enter weight and height.");

    function calculateCals(containerId) {
        let total = 0;
        document.querySelectorAll(`#${containerId} .leg-item`).forEach(item => {
            const met = parseFloat(item.querySelector('.leg-activity').value);
            const mins = parseFloat(item.querySelector('.leg-duration').value) || 0;
            total += (met - 1) * 0.0175 * weight * mins;
        });
        return total;
    }

    const outward = calculateCals('outward-legs');
    const inward = isSameReturn ? outward : calculateCals('return-legs');
    const monthlyBurn = (outward + inward) * days * 4.33;
    const kgLost = monthlyBurn / 7700;

    const bmi = weight / ((heightCm / 100) ** 2);
    const newBmi = (weight - kgLost) / ((heightCm / 100) ** 2);

    // Update Text Results
    document.getElementById('results').classList.remove('hidden');
    document.getElementById('newBMIDisplay').innerText = newBmi.toFixed(1);
    document.getElementById('calOut').innerText = Math.round(monthlyBurn).toLocaleString();
    document.getElementById('weightOut').innerText = kgLost.toFixed(2);

    // Determine Category Text
    let category = "";
    if (newBmi < 18.5) category = "underweight";
    else if (newBmi < 25) category = "a healthy weight";
    else if (newBmi < 30) category = "overweight";
    else category = "obese";
    document.getElementById('categoryText').innerText = category;

    // Position Marker (View range: BMI 10 to 40)
    // 10 = 0%, 40 = 100%
    let percent = ((newBmi - 10) / (40 - 10)) * 100;
    percent = Math.max(5, Math.min(95, percent)); // Keep within bounds
    document.getElementById('marker-new').style.left = percent + '%';

    const pizza = Math.floor(monthlyBurn / 250);
    document.getElementById('insight').innerText = `Your commute burns the equivalent of ${pizza} slices of pizza every month!`;
    
    document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
});
