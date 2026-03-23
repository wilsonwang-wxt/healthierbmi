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

function toggleReturn() {
    const isSame = document.getElementById('sameReturn').checked;
    document.getElementById('returnSection').classList.toggle('hidden', isSame);
}

document.getElementById('toggleMethod').addEventListener('click', () => {
    document.getElementById('methodology').classList.toggle('hidden');
});

document.getElementById('calcBtn').addEventListener('click', function() {
    const weight = parseFloat(document.getElementById('weight').value);
    const heightCm = parseFloat(document.getElementById('height').value);
    const days = parseInt(document.getElementById('days').value);
    const isSameReturn = document.getElementById('sameReturn').checked;

    if (!weight || !heightCm) return alert("Please enter weight and height.");

    function getContainerCalories(containerId) {
        let total = 0;
        document.querySelectorAll(`#${containerId} .leg-row`).forEach(row => {
            const met = parseFloat(row.querySelector('.leg-activity').value);
            const mins = parseFloat(row.querySelector('.leg-duration').value) || 0;
            total += (met - 1) * 0.0175 * weight * mins;
        });
        return total;
    }

    const outwardCals = getContainerCalories('outward-legs');
    const returnCals = isSameReturn ? outwardCals : getContainerCalories('return-legs');
    
    const monthlyBurn = (outwardCals + returnCals) * days * 4.33;
    const kgLost = monthlyBurn / 7700;

    const heightM = heightCm / 100;
    const oldBMI = weight / (heightM * heightM);
    const newBMI = (weight - kgLost) / (heightM * heightM);

    // Update UI
    document.getElementById('results').classList.remove('hidden');
    document.getElementById('calOut').innerText = Math.round(monthlyBurn).toLocaleString();
    document.getElementById('weightOut').innerText = kgLost.toFixed(2);
    document.getElementById('oldBMIText').innerText = oldBMI.toFixed(1);
    document.getElementById('newBMIText').innerText = newBMI.toFixed(1);

    // Position Markers (Scale is from BMI 15 to 40)
    function getPosition(bmi) {
        let percentage = ((bmi - 15) / (40 - 15)) * 100;
        return Math.max(0, Math.min(100, percentage)); // Clamp between 0-100%
    }

    document.getElementById('marker-old').style.left = getPosition(oldBMI) + '%';
    document.getElementById('marker-new').style.left = getPosition(newBMI) + '%';

    // Fun Insight
    const pizzaSlices = Math.floor(monthlyBurn / 250);
    document.getElementById('insight').innerText = `Your monthly commute burns the equivalent of ${pizzaSlices} slices of pepperoni pizza!`;
    
    document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
});
