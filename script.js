document.getElementById('calcBtn').addEventListener('click', function() {
    const weight = parseFloat(document.getElementById('weight').value);
    const heightCm = parseFloat(document.getElementById('height').value);
    const days = parseInt(document.getElementById('days').value);
    const isSameReturn = document.getElementById('sameReturn').checked;

    if (!weight || !heightCm) return alert("Please enter weight and height.");

    // Calculation Engine
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

    // Update Text Results
    document.getElementById('results').classList.remove('hidden');
    document.getElementById('calOut').innerText = Math.round(monthlyBurn).toLocaleString();
    document.getElementById('weightOut').innerText = kgLost.toFixed(2);
    document.getElementById('oldBMIText').innerText = oldBMI.toFixed(1);
    document.getElementById('newBMIText').innerText = newBMI.toFixed(1);

    // Marker Positioning (Range: 15 to 40)
    function getPosition(bmi) {
        // We calculate position as a percentage of the bar width
        let percentage = ((bmi - 15) / (40 - 15)) * 100;
        return Math.max(0, Math.min(100, percentage)); 
    }

    // Apply positions
    document.getElementById('marker-old').style.left = getPosition(oldBMI) + '%';
    document.getElementById('marker-new').style.left = getPosition(newBMI) + '%';

    // Fun Fact
    const pizzaSlices = Math.floor(monthlyBurn / 250);
    document.getElementById('insight').innerText = `Fun Fact: Your commute burns the equivalent of ${pizzaSlices} slices of pizza per month!`;
    
    document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
});
