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
        <button onclick="this.parentElement.remove()" style="border:none; background:none; cursor:pointer; font-size:1.2rem;">✕</button>
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

    const heightM = heightCm / 100;
    const oldBmi = weight / (heightM * heightM);
    const newBmi = (weight - kgLost) / (heightM * heightM);

    // Update UI
    document.getElementById('results').classList.remove('hidden');
    document.getElementById('newBMIDisplay').innerText = newBmi.toFixed(1);
    document.getElementById('calOut').innerText = Math.round(monthlyBurn).toLocaleString();
    document.getElementById('weightOut').innerText = kgLost.toFixed(2);

    // Table update
    document.getElementById('oldWeightTable').innerText = weight;
    document.getElementById('newWeightTable').innerText = (weight - kgLost).toFixed(1);
    document.getElementById('oldBMITable').innerText = oldBmi.toFixed(1);
    document.getElementById('newBMITable').innerText = newBmi.toFixed(1);

    // Category Text
    let category = "";
    if (newBmi < 18.5) category = "underweight";
    else if (newBmi < 25) category = "a healthy weight";
    else if (newBmi < 30) category = "overweight";
    else category = "obese";
    document.getElementById('categoryText').innerText = category;

    // Marker Logic (BMI range 15 to 40)
    function getPercent(bmi) {
        let p = ((bmi - 15) / (40 - 15)) * 100;
        return Math.max(0, Math.min(100, p));
    }

    document.getElementById('marker-old').style.left = getPercent(oldBmi) + '%';
    document.getElementById('marker-new').style.left = getPercent(newBmi) + '%';

    document.getElementById('insight').innerText = `Your commute burns the equivalent of ${Math.floor(monthlyBurn / 250)} slices of pizza every month!`;
    document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
});
