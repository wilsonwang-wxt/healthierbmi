document.getElementById('calcBtn').addEventListener('click', function() {
    const weight = parseFloat(document.getElementById('weight').value);
    const heightCm = parseFloat(document.getElementById('height').value);
    const days = parseInt(document.getElementById('days').value);
    const months = parseInt(document.getElementById('months').value); // New variable
    const isSameReturn = document.getElementById('sameReturn').checked;

    // Range Validation (Keep your constraints)
    if (weight < 25.4 || weight > 317.5) return alert("Please enter weight between 25.4 and 317.5 kg.");
    if (heightCm < 139.7 || heightCm > 243.8) return alert("Please enter height between 139.7 and 243.8 cm.");

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
    
    // Calculate Monthly, then multiply by selected months
    const monthlyExtraBurn = (outward + inward) * days * 4.33;
    const totalExtraBurn = monthlyExtraBurn * months;
    const totalKgLost = totalExtraBurn / 7700;

    const heightM = heightCm / 100;
    const oldBMI = weight / (heightM * heightM);
    const newBMI = (weight - totalKgLost) / (heightM * heightM);

    // UI Updates
    document.getElementById('results').classList.remove('hidden');
    document.getElementById('resultsHeader').innerText = `${months}-Month Projection`;
    document.getElementById('calOut').innerText = Math.round(totalExtraBurn).toLocaleString();
    document.getElementById('weightOut').innerText = totalKgLost.toFixed(2);
    document.getElementById('oldBMIText').innerText = oldBMI.toFixed(1);
    document.getElementById('newBMIText').innerText = newBMI.toFixed(1);

    // Marker Positioning (Mapping BMI 15-40 range)
    function getPercent(bmi) {
        let p = ((bmi - 15) / (40 - 15)) * 100;
        return Math.max(0, Math.min(100, p));
    }

    document.getElementById('marker-old').style.left = getPercent(oldBMI) + '%';
    document.getElementById('marker-new').style.left = getPercent(newBMI) + '%';

    // Fun Fact (adjusted for timeframe)
    const slices = Math.floor(totalExtraBurn / 250);
    document.getElementById('insight').innerText = `Fun Fact: In ${months} month(s), your commute will burn the equivalent of ${slices} slices of pizza!`;
    
    document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
});
