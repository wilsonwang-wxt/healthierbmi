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
        <input type="number" class="leg-duration" placeholder="Mins">
        <button type="button" style="border:none; background:none; color:red; cursor:pointer;" onclick="this.parentElement.remove()">✕</button>
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
            // Formula: (MET - 1) * 0.0175 * Weight * Mins
            total += (met - 1) * 0.0175 * weight * mins;
        });
        return total;
    }

    const outward = calculateCals('outward-legs');
    const inward = isSameReturn ? outward : calculateCals('return-legs');
    
    const monthlyExtraBurn = (outward + inward) * days * 4.33;
    const kgLost = monthlyExtraBurn / 7700;

    const heightM = heightCm / 100;
    const oldBMI = weight / (heightM * heightM);
    const newBMI = (weight - kgLost) / (heightM * heightM);

    // Update Text Results
    document.getElementById('results').classList.remove('hidden');
    document.getElementById('calOut').innerText = Math.round(monthlyExtraBurn).toLocaleString();
    document.getElementById('weightOut').innerText = kgLost.toFixed(2);
    document.getElementById('oldBMIText').innerText = oldBMI.toFixed(1);
    document.getElementById('newBMIText').innerText = newBMI.toFixed(1);

    // Marker Positioning (Mapping BMI 15-40 to 0-100%)
    function getPercent(bmi) {
        let p = ((bmi - 15) / (40 - 15)) * 100;
        return Math.max(0, Math.min(100, p));
    }

    document.getElementById('marker-old').style.left = getPercent(oldBMI) + '%';
    document.getElementById('marker-new').style.left = getPercent(newBMI) + '%';

    // Fun Fact
    const slices = Math.floor(monthlyExtraBurn / 250);
    document.getElementById('insight').innerText = `Fun Fact: Your commute burns the equivalent of ${slices} slices of pizza every month!`;
    
    document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
});
