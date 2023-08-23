document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('dataForm');
    const downloadLink = document.getElementById('downloadLink');
    const formEntriesContainer = document.getElementById('formEntries');

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const teamColor = document.querySelector('input[name="teamColor"]:checked').value;
        const team = parseInt(document.getElementById('team').value);
        const startPos = document.querySelector('input[name="start_pos"]:checked').value;
        const coneHigh = parseInt(document.querySelector('input[name="cone_high"]:checked').value);
        const coneMid = parseInt(document.querySelector('input[name="cone_mid"]:checked').value);
        const coneLow = parseInt(document.querySelector('input[name="cone_low"]:checked').value);
        const cubeHigh = parseInt(document.querySelector('input[name="cube_high"]:checked').value);
        const cubeMid = parseInt(document.querySelector('input[name="cube_mid"]:checked').value);
        const cubeLow = parseInt(document.querySelector('input[name="cube_low"]:checked').value);
        const mobility = document.querySelector('input[name="mobility"]:checked').value;

        // Checkboxes for Cone Intake
        const coneIntakeCheckboxes = document.querySelectorAll('input[name="cone_intake"]:checked');
        const coneIntake = Array.from(coneIntakeCheckboxes).map(checkbox => checkbox.value);

        // Checkboxes for Cube Intake
        const cubeIntakeCheckboxes = document.querySelectorAll('input[name="cube_intake"]:checked');
        const cubeIntake = Array.from(cubeIntakeCheckboxes).map(checkbox => checkbox.value);

        // Save the data in localStorage
        saveDataLocally(teamColor, team, startPos, coneHigh, coneMid, coneLow, cubeHigh, cubeMid, cubeLow, mobility, coneIntake, cubeIntake);

        // Clear form fields after submission
        form.reset();

        // Update the form entries display
        updateFormEntries();
    });

    function saveDataLocally(teamColor, team, startPos, coneHigh, coneMid, coneLow, cubeHigh, cubeMid, cubeLow, mobility, coneIntake, cubeIntake) {
        const formData = {
            teamColor,
            team,
            startPos,
            coneHigh,
            coneMid,
            coneLow,
            cubeHigh,
            cubeMid,
            cubeLow,
            mobility,
            coneIntake,
            cubeIntake
        };

        // Check if data already exists in localStorage
        let existingData = JSON.parse(localStorage.getItem('formDataList')) || [];

        // Add the new form data to the existing list
        existingData.push(formData);

        // Store the updated list in localStorage
        localStorage.setItem('formDataList', JSON.stringify(existingData));
    }
    

    function updateFormEntries() {
        const formDataList = JSON.parse(localStorage.getItem('formDataList'));
        if (formDataList && formDataList.length > 0) {
            formEntriesContainer.innerHTML = '<h2>Form Entries</h2>';
            let tableHTML = '<table border="1"><tr><th>Team Color</th><th>Team</th><th>Start Position</th><th>Cone High</th><th>Cone Mid</th><th>Cone Low</th><th>Cube High</th><th>Cube Mid</th><th>Cube Low</th><th>Mobility</th><th>Cone Intake</th><th>Cube Intake</th></tr>';

            formDataList.forEach(formData => {
                tableHTML += `<tr><td>${formData.teamColor}</td><td>${formData.team}</td><td>${formData.startPos}</td><td>${formData.coneHigh}</td><td>${formData.coneMid}</td><td>${formData.coneLow}</td><td>${formData.cubeHigh}</td><td>${formData.cubeMid}</td><td>${formData.cubeLow}</td><td>${formData.mobility}</td><td>${formData.coneIntake.join(', ')}</td></tr>${formData.cubeIntake.join(', ')}</td></tr>`;
            });

            tableHTML += '</table>';
            formEntriesContainer.innerHTML += tableHTML;

            // Display the download link
            downloadLink.style.display = 'block';
        }
    }

    function generateCSVContent() {
        const formDataList = JSON.parse(localStorage.getItem('formDataList'));
        if (formDataList && formDataList.length > 0) {
            let csvContent = 'Team Color,Team,Start Position,Cone High,Cone Mid,Cone Low,Cube High,Cube Mid,Cube Low,Mobility,Cone Intake,Cube Intake\n';

            formDataList.forEach(formData => {
                csvContent += `${formData.teamColor},${formData.team},${formData.startPos},${formData.coneHigh},${formData.coneMid},${formData.coneLow},${formData.cubeHigh},${formData.cubeMid},${formData.cubeLow},${formData.mobility},"${formData.coneIntake.join(', ')}","${formData.cubeIntake.join(', ')}"\n`;
            });

            return csvContent;
        }
        return null;
    }

    function downloadCSV() {
        const csvContent = generateCSVContent();
        if (csvContent) {
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'form_data.csv';
            link.style.display = 'none';

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Clear the stored form data from local storage
            localStorage.removeItem('formDataList');

            // Update the form entries display after clearing
            updateFormEntries();
        }
    }

    updateFormEntries();

    downloadLink.addEventListener('click', function () {
        downloadCSV();
    });
});