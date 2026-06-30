const activityOptions = `
    <option value="3.5">Walking (Brisk)</option>
    <option value="6.8">Cycling</option>
    <option value="3.0">E-Bike</option>
    <option value="1.5">Public Transport</option>
`;

function addLeg(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const leg = document.createElement('div');
    leg.className = 'leg-item';
    leg.innerHTML = `
        <select class="leg-activity" aria-label="Travel mode">
            ${activityOptions}
        </select>
        <input type="number" class="leg-duration" value="20" min="0" max="1440" placeholder="Mins" aria-label="Duration in minutes">
        <button type="button" class="btn-remove" aria-label="Remove leg">×</button>
    `;
    leg.querySelector('.btn-remove').addEventListener('click', () => leg.remove());
    container.appendChild(leg);
}

function toggleReturn() {
    const isSameReturn = document.getElementById('sameReturn').checked;
    document.getElementById('returnSection').classList.toggle('hidden', isSameReturn);
}

document.getElementById('calcBtn').addEventListener('click', function() {
    const weight = parseFloat(document.getElementById('weight').value);
    const heightCm = parseFloat(document.getElementById('height').value);
    const days = parseInt(document.getElementById('days').value);
    const months = parseInt(document.getElementById('months').value, 10);
    const isSameReturn = document.getElementById('sameReturn').checked;

    if (!Number.isFinite(weight) || !Number.isFinite(heightCm)) {
        return alert("Please enter a valid weight and height.");
    }

    if (weight < 25.4 || weight > 317.5) return alert("Please enter weight between 25.4 and 317.5 kg.");
    if (heightCm < 139.7 || heightCm > 243.8) return alert("Please enter height between 139.7 and 243.8 cm.");

    function calculateCals(containerId) {
        let total = 0;
        document.querySelectorAll(`#${containerId} .leg-item`).forEach(item => {
            const met = parseFloat(item.querySelector('.leg-activity').value);
            const mins = parseFloat(item.querySelector('.leg-duration').value);
            if (!Number.isFinite(mins) || mins < 0 || mins > 1440) {
                throw new Error('Please enter each journey duration between 0 and 1,440 minutes.');
            }
            total += (met - 1) * 0.0175 * weight * mins;
        });
        return total;
    }

    let outward;
    let inward;
    try {
        outward = calculateCals('outward-legs');
        inward = isSameReturn ? outward : calculateCals('return-legs');
    } catch (error) {
        return alert(error.message);
    }
    
    const monthlyExtraBurn = (outward + inward) * days * 4.33;
    const totalExtraBurn = monthlyExtraBurn * months;
    const totalKgLost = totalExtraBurn / 7700;

    const heightM = heightCm / 100;
    const oldBMI = weight / (heightM * heightM);
    const newBMI = (weight - totalKgLost) / (heightM * heightM);

    document.getElementById('results').classList.remove('hidden');
    document.getElementById('resultsHeader').innerText = `${months}-Month Projection`;
    document.getElementById('calOut').innerText = Math.round(totalExtraBurn).toLocaleString();
    document.getElementById('weightOut').innerText = totalKgLost.toFixed(2);
    document.getElementById('oldBMIText').innerText = oldBMI.toFixed(1);
    document.getElementById('newBMIText').innerText = newBMI.toFixed(1);

    function getPercent(bmi) {
        let p = ((bmi - 15) / (40 - 15)) * 100;
        return Math.max(0, Math.min(100, p));
    }

    document.getElementById('marker-old').style.left = getPercent(oldBMI) + '%';
    document.getElementById('marker-new').style.left = getPercent(newBMI) + '%';

    const slices = Math.floor(totalExtraBurn / 250);
    document.getElementById('insight').innerText = `Fun Fact: In ${months} month(s), your commute will burn the equivalent of ${slices} slices of pizza!`;
    
    document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
});
