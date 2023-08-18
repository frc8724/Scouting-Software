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

        // Save the data in localStorage
        saveDataLocally(teamColor, team, startPos, coneHigh, coneMid, coneLow, cubeHigh, cubeMid, cubeLow, mobility);

        // Clear form fields after submission
        form.reset();

        // Update the form entries display
        updateFormEntries();
    });

    function saveDataLocally(teamColor, team, startPos, coneHigh, coneMid, coneLow, cubeHigh, cubeMid, cubeLow, mobility) {
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
            mobility
        };

        // Check if data already exists in localStorage
        let existingData = JSON.parse(localStorage.getItem('formDataList')) || [];

        // Add the new form data to the existing list
        existingData.push(formData);

        // Store the updated list in localStorage
        localStorage.setItem('formDataList', JSON.stringify(existingData));
    }

    function clearDataLocally() {
        localStorage.removeItem('formDataList');
    }

    function updateFormEntries() {
        const formDataList = JSON.parse(localStorage.getItem('formDataList'));
        if (formDataList && formDataList.length > 0) {
            formEntriesContainer.innerHTML = '<h2>Form Entries</h2>';
            let tableHTML = '<table border="1"><tr><th>Team Color</th><th>Team</th><th>Start Position</th><th>Cone High</th><th>Cone Mid</th><th>Cone Low</th><th>Cube High</th><th>Cube Mid</th><th>Cube Low</th><th>Mobility</th></tr>';

            formDataList.forEach(formData => {
                tableHTML += `<tr><td>${formData.teamColor}</td><td>${formData.team}</td><td>${formData.startPos}</td><td>${formData.coneHigh}</td><td>${formData.coneMid}</td><td>${formData.coneLow}</td><td>${formData.cubeHigh}</td><td>${formData.cubeMid}</td><td>${formData.cubeLow}</td><td>${formData.mobility}</td></tr>`;
            });

            tableHTML += '</table>';
            formEntriesContainer.innerHTML += tableHTML;
        }
    }

    function generateCSVContent() {
        const formDataList = JSON.parse(localStorage.getItem('formDataList'));
        if (formDataList && formDataList.length > 0) {
            let csvContent = 'data:text/csv;charset=utf-8,';
            csvContent += 'Team Color,Team,Start Position,Cone High,Cone Mid,Cone Low,Cube High,Cube Mid,Cube Low,Mobility\n';

            formDataList.forEach(formData => {
                csvContent += `${formData.teamColor},${formData.team},${formData.startPos},${formData.coneHigh},${formData.coneMid},${formData.coneLow},${formData.cubeHigh},${formData.cubeMid},${formData.cubeLow},${formData.mobility}\n`;
            });

            return csvContent;
        }
        return null;
    }

    function downloadCSV() {
        const csvContent = generateCSVContent();
        if (csvContent) {
            const encodedUri = encodeURI(csvContent);
            downloadLink.setAttribute('href', encodedUri);
            downloadLink.setAttribute('download', 'form_data.csv');
            downloadLink.style.display = 'block';
        }
    }

    updateFormEntries();

    downloadLink.addEventListener('click', function () {
        downloadCSV();
        clearDataLocally();
        updateFormEntries();
    });
});