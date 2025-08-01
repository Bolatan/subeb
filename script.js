// Navigation logic for landing/surveys
function showSurvey(survey) {
    document.getElementById('landingPage').classList.add('hidden');
    ['silnat','tcmats','lori','voices', 'silnat_new', 'silat_1.2', 'silat_1.3', 'silat_1.4'].forEach(s => {
        const section = document.getElementById(s + 'Section');
        if (section) {
            section.classList.add('hidden');
        }
    });

    // Special handling for silnat_1.3 -> silat_1.3Section
    let sectionToShow = survey;
    if (survey === 'silnat_1.3') {
        sectionToShow = 'silat_1.3';
    } else if (survey === 'silat_1.2') {
        sectionToShow = 'silat_1.2';
    } else if (survey === 'silat_1.4') {
        sectionToShow = 'silat_1.4';
    }


    const targetSection = document.getElementById(sectionToShow + 'Section');
    if (targetSection) {
        targetSection.classList.remove('hidden');
    }



    // Hide main app unless you want to show it for a survey
    document.getElementById('mainApp').classList.add('hidden');
}
function backToLanding() {
    document.getElementById('landingPage').classList.remove('hidden');
    ['silnat','tcmats','lori','voices', 'silat_1.2', 'silat_1.3', 'silat_1.4'].forEach(s => {
        const section = document.getElementById(s + 'Section');
        if (section) {
            section.classList.add('hidden');
        }
    });
    document.getElementById('mainApp').classList.add('hidden');
}
// On load, show login page only
window.onload = function() {
    document.getElementById('authScreen').classList.remove('hidden');
    document.getElementById('landingPage').classList.add('hidden');
    ['silnat','tcmats','lori','voices'].forEach(s => {
        document.getElementById(s+'Section').classList.add('hidden');
    });
    document.getElementById('mainApp').classList.add('hidden');
};
// Lagos State Local Government Areas and Primary Schools Data
let lagosStateData = { "Agege": [ "Agege Primary School I", "Agege Primary School II", "Oko-Oba Primary School", "Mulero Primary School", "Pen Cinema Primary School", "Dopemu Primary School" ], "Ajeromi-Ifelodun": [ "Ajeromi Primary School", "Ifelodun Primary School I", "Ifelodun Primary School II", "Boundary Primary School", "Alakija Primary School", "Olodi Primary School" ], "Alimosho": [ "Alimosho Primary School I", "Alimosho Primary School II", "Idimu Primary School", "Ikotun Primary School", "Egbe Primary School", "Iyana Ipaja Primary School" ], "Amuwo-Odofin": [ "Amuwo-Odofin Primary School", "Festac Primary School I", "Festac Primary School II", "Trade Fair Primary School", "Mile 2 Primary School", "Kirikiri Primary School" ], "Apapa": [ "Apapa Primary School I", "Apapa Primary School II", "Liverpool Primary School", "Creek Road Primary School", "Point Road Primary School", "Warehouse Primary School" ], "Badagry": [ "Badagry Primary School I", "Badagry Primary School II", "Ajara Primary School", "Iworo Primary School", "Koga Primary School", "Topo Primary School" ], "Epe": [ "Epe Primary School I", "Epe Primary School II", "Ejinrin Primary School", "Noforija Primary School", "Lekki Primary School", "Orimedu Primary School" ], "Eti-Osa": [ "Victoria Island Primary School", "Ikoyi Primary School", "Lekki Phase I Primary School", "Ajah Primary School", "Eti-Osa Primary School", "Ilasan Primary School" ], "Ibeju-Lekki": [ "Ibeju Primary School", "Lekki Primary School", "Akodo Primary School", "Elemoro Primary School", "Bogije Primary School", "Eleko Primary School" ], "Ifako-Ijaiye": [ "Ifako Primary School", "Ijaiye Primary School I", "Ijaiye Primary School II", "Alakuko Primary School", "Ojokoro Primary School", "Agbado Primary School" ], "Ikeja": [ "Ikeja Primary School I", "Ikeja Primary School II", "GRA Primary School", "Maryland Primary School", "Alausa Primary School", "Computer Village Primary School" ], "Ikorodu": [ "Ikorodu Primary School I", "Ikorodu Primary School II", "Igbogbo Primary School", "Bayeku Primary School", "Ijede Primary School", "Imota Primary School" ], "Kosofe": [ "Kosofe Primary School", "Ketu Primary School I", "Ketu Primary School II", "Mile 12 Primary School", "Owode Primary School", "Agboyi Primary School" ], "Lagos Island": [ "Lagos Island Primary School I", "Lagos Island Primary School II", "Tafawa Balewa Primary School", "Campos Primary School", "Oke-Arin Primary School", "Marina Primary School" ], "Lagos Mainland": [ "Lagos Mainland Primary School", "Yaba Primary School I", "Yaba Primary School II", "Ebute-Metta Primary School", "Oyingbo Primary School", "Sabo Primary School" ], "Mushin": [ "Mushin Primary School I", "Mushin Primary School II", "Papa Ajao Primary School", "Isolo Primary School", "Idi-Oro Primary School", "Oke-Afa Primary School" ], "Ojo": [ "Ojo Primary School I", "Ojo Primary School II", "Alaba Primary School", "Okokomaiko Primary School", "Shibiri Primary School", "Igando Primary School" ], "Oshodi-Isolo": [ "Oshodi Primary School I", "Oshodi Primary School II", "Isolo Primary School I", "Isolo Primary School II", "Mafoluku Primary School", "Bolade Primary School" ], "Shomolu": [ "Shomolu Primary School I", "Shomolu Primary School II", "Bariga Primary School", "Pedro Primary School", "Akoka Primary School", "Gbagada Primary School" ], "Surulere": [ "Surulere Primary School I", "Surulere Primary School II", "Itire Primary School", "Lawanson Primary School", "Aguda Primary School", "Adelabu Primary School" ] };

// Load lagosStateData from localStorage if present
(function loadLagosStateData() {
    try {
        const savedLagosData = localStorage.getItem('lagosStateData');
        if (savedLagosData) {
            lagosStateData = JSON.parse(savedLagosData);
        }
    } catch (e) {
        console.error('Error loading lagosStateData from localStorage:', e);
    }
})();

// --- Load lagosStateData from backend if available ---
(async function fetchLagosStateDataFromBackend() {
    try {
        const response = await fetch('/api/lgas');
        if (response.ok) {
            const result = await response.json();
            if (result.success && result.lagosStateData && Object.keys(result.lagosStateData).length > 0) {
                lagosStateData = result.lagosStateData;
                localStorage.setItem('lagosStateData', JSON.stringify(lagosStateData));
                loadLocalGovernments && loadLocalGovernments();
                console.log('Loaded lagosStateData from backend.');
            }
        }
    } catch (e) {
        console.warn('Could not fetch lagosStateData from backend:', e);
    }
})();

// Global variables
        let currentUser = null;
        let auditData = [];
        let uploadedFiles = [];
        let isOnline = navigator.onLine;

        // Replace the existing window.onload function
window.onload = function() {
    console.log('App initialized');
    loadSession();
    if (currentUser) {
        document.getElementById('authScreen').classList.add('hidden');
        document.getElementById('landingPage').classList.remove('hidden');
        document.getElementById('mainApp').classList.add('hidden');
        loadData();
        loadLocalGovernments();
        updateDashboard();
        loadRecords();
        updateConnectionStatus();
    } else {
        document.getElementById('authScreen').classList.remove('hidden');
        document.getElementById('mainApp').classList.add('hidden');
        document.getElementById('landingPage').classList.add('hidden');
    }
};


// Add this new function to load saved session
function loadSession() {
    try {
        const savedUser = localStorage.getItem('auditAppCurrentUser');
        if (savedUser) {
            currentUser = savedUser;
            document.getElementById('authScreen').classList.add('hidden');
            document.getElementById('mainApp').classList.remove('hidden');
            console.log('Session restored for user:', currentUser);
        }
    } catch (e) {
        console.error('Error loading session:', e);
    }
}


       // --- PATCH: Fix frontend login bug (robust trim, lowercase, and error display) ---
function login() {
    const username = document.getElementById('username').value.trim().toLowerCase();
    const password = document.getElementById('password').value.trim();
    console.log('Login attempt:', username, password);
    // Accept only exact credentials (case-insensitive username)
    if ((username === 'admin' && password === 'password123') ||
        (username === 'auditor' && password === 'audit2024')) {
        currentUser = username;
        // Save session to localStorage
        localStorage.setItem('auditAppCurrentUser', username);
        document.getElementById('authScreen').classList.add('hidden');
        document.getElementById('landingPage').classList.remove('hidden');
        document.getElementById('mainApp').classList.add('hidden');
        console.log('Login successful');
        loadData();
        loadLocalGovernments();
        updateDashboard();
        loadRecords();
        updateConnectionStatus();
    } else {
        // Show error message in UI
        let msg = document.getElementById('loginErrorMsg');
        if (!msg) {
            msg = document.createElement('div');
            msg.id = 'loginErrorMsg';
            msg.style.color = 'var(--lagos-red)';
            msg.style.marginTop = '10px';
            msg.style.textAlign = 'center';
            document.getElementById('authScreen').appendChild(msg);
        }
        msg.textContent = 'Invalid credentials!\n\nValid login credentials:\n• admin / password123\n• auditor / audit2024';
        setTimeout(()=>{msg.textContent='';}, 5000);
        console.log('Login failed');
    }
}

// Modify the existing logout function (replace the existing one)
function logout() {
    currentUser = null;
    // Remove session from localStorage
    localStorage.removeItem('auditAppCurrentUser');

    document.getElementById('authScreen').classList.remove('hidden');
    document.getElementById('mainApp').classList.add('hidden');
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';

}

        // Navigation
        function showSection(sectionName, navElem) {
            // Hide all sections
            const sections = document.querySelectorAll('.section');
            sections.forEach(section => section.classList.add('hidden'));

            // Show selected section
            document.getElementById(sectionName + 'Section').classList.remove('hidden');

            // Update navigation
            const navItems = document.querySelectorAll('.nav-item');
            navItems.forEach(item => item.classList.remove('active'));
            if (navElem) {
                navElem.classList.add('active');
            }
            if (sectionName === 'dashboard') updateDashboard();
    if (sectionName === 'records') loadRecords(); // Use loadRecords instead of loadFromServer
    if (sectionName === 'sync') updateSyncSection && updateSyncSection();
        }

        // Get current location
        function getLocation() {
            if (!navigator.geolocation) {
                alert('Geolocation is not supported by this browser.');
                return;
            }

            navigator.geolocation.getCurrentPosition(
                function(position) {
                    document.getElementById('latitude').value = position.coords.latitude;
                    document.getElementById('longitude').value = position.coords.longitude;
                    alert('Location captured successfully!');
                },
                function(error) {
                    alert('Error getting location: ' + error.message);
                }
            );
        }


// Resize image to max width/height before saving as base64
function resizeImage(file, maxSize = 400, quality = 0.4) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                let width = img.width;
                let height = img.height;
                if (width > height) {
                    if (width > maxSize) {
                        height *= maxSize / width;
                        width = maxSize;
                    }
                } else {
                    if (height > maxSize) {
                        width *= maxSize / height;
                        height = maxSize;
                    }
                }
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                // Use JPEG for better compression, fallback to PNG
                let mimeType = file.type === "image/png" ? "image/png" : "image/jpeg";
                resolve(canvas.toDataURL(mimeType, quality));
            };
            img.onerror = reject;
            img.src = e.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

        // Handle file uploads
     // Handle file uploads
function handleFiles(files) {
    const maxPhotos = 5;
    let filesToAdd = Array.from(files);
    if (uploadedFiles.length + filesToAdd.length > maxPhotos) {
        filesToAdd = filesToAdd.slice(0, maxPhotos - uploadedFiles.length);
        document.getElementById('photoLimitMsg').style.display = 'block';
    } else {
        document.getElementById('photoLimitMsg').style.display = 'none';
    }
    let resizePromises = [];
    for (let i = 0; i < filesToAdd.length; i++) {
        const file = filesToAdd[i];
        if (file.type.startsWith('image/')) {
            // Resize before saving
            const p = resizeImage(file).then(resizedDataUrl => {
                uploadedFiles.push({
                    name: file.name,
                    data: resizedDataUrl,

                    type: file.type
                });
                displayFile(file.name, resizedDataUrl);
            });
            resizePromises.push(p);
        }
    }
    Promise.all(resizePromises).then(updateFileDisplay);
}

        // Add this anywhere in your <script> tag
function toggleMobileSidebar() {
    const sidebar = document.getElementById('mobileSidebar');
    if (sidebar) {
        sidebar.classList.toggle('hidden');
    }
}
        function displayFile(name, dataUrl) {
            const container = document.getElementById('uploadedFiles');
            const fileDiv = document.createElement('div');
            fileDiv.className = 'file-preview';
            // Add a download button for the image
            fileDiv.innerHTML = `
                <img src="${dataUrl}" alt="${name}">
                <button class="file-remove" onclick="removeFile('${name}')">×</button>
                <a href="${dataUrl}" download="${name}" class="file-download" title="Download"><span style="font-size:18px;position:absolute;bottom:5px;right:5px;background:rgba(30,64,175,0.8);color:#fff;padding:2px 8px;border-radius:6px;">⬇️</span></a>
            `;
            container.appendChild(fileDiv);
        }
        function removeFile(name) {
            uploadedFiles = uploadedFiles.filter(file => file.name !== name);
            updateFileDisplay();
            if (uploadedFiles.length < 5) {
                document.getElementById('photoLimitMsg').style.display = 'none';
            }
        }
        function updateFileDisplay() {
            const container = document.getElementById('uploadedFiles');
            container.innerHTML = '';
            uploadedFiles.forEach(file => {
                displayFile(file.name, file.data);
            });
            if (uploadedFiles.length >= 5) {
                document.getElementById('fileInput').disabled = true;
            } else {
                document.getElementById('fileInput').disabled = false;
            }
        }

 // Load Local Government Areas into dropdown
 function loadLocalGovernments() {
    const localGovDropdown1 = document.getElementById('localGov-1');
    const localGovDropdown2 = document.getElementById('localGov-2');
    const lgas = Object.keys(lagosStateData).sort();
    [localGovDropdown1, localGovDropdown2].forEach(dropdown => {
        if (dropdown) {
            dropdown.innerHTML = '<option value="">Select Local Government</option>';
            lgas.forEach(lga => {
                const option = document.createElement('option');
                option.value = lga;
                option.textContent = lga;
                dropdown.appendChild(option);
            });
        }
    });
    // Reset school dropdown
    const schoolDropdown1 = document.getElementById('schoolName-1');
    if(schoolDropdown1) {
        schoolDropdown1.innerHTML = '<option value="">Select LGA first</option>';
        schoolDropdown1.disabled = true;
    }
    const schoolDropdown2 = document.getElementById('schoolName-2');
    if(schoolDropdown2) {
        schoolDropdown2.innerHTML = '<option value="">Select LGA first</option>';
        schoolDropdown2.disabled = true;
    }
}

function loadSchools(dropdownNum) {
    const localGov = document.getElementById(`localGov-${dropdownNum}`).value;
    const schoolDropdown = document.getElementById(`schoolName-${dropdownNum}`);
    schoolDropdown.innerHTML = '<option value="">Select Primary School</option>';
    if (!localGov) {
        schoolDropdown.disabled = true;
        schoolDropdown.innerHTML = '<option value="">Select LGA first</option>';
        return;
    }
    schoolDropdown.disabled = false;
    const schools = lagosStateData[localGov] || [];
    schools.forEach(school => {
        const option = document.createElement('option');
        option.value = school;
        option.textContent = school;
        schoolDropdown.appendChild(option);
    });
}


// --- CSV IMPORT: Replace LGAs and Schools in Form Dropdowns and Import Records ---
function handleCSVUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    if (!file.name.endsWith('.csv')) {
        document.getElementById('csvUploadMsg').textContent = 'Please select a valid CSV file.';
        return;
    }
    const reader = new FileReader();
    reader.onload = async function(e) {
        const text = e.target.result;
        const result = parseCSV(text);
        if (result.error) {
            document.getElementById('csvUploadMsg').textContent = result.error;
            return;
        }
        // Build new LGA->Schools mapping from CSV (only use School Name and Local Government fields)
        const csvLgaSchools = {};
        result.data.forEach((row) => {
            const getAny = (...keys) => {
                for (const k of keys) {
                    for (const header of Object.keys(row)) {
                        if (header.replace(/\s|_/g, '').toLowerCase() === k.replace(/\s|_/g, '').toLowerCase()) {
                            return (row[header] !== undefined && row[header] !== null) ? String(row[header]).trim() : '';
                        }
                    }
                }
                return '';
            };
            const lga = getAny('Local Government', 'LGA');
            const school = getAny('School Name', 'School');
            if (!lga || !school) return;
            if (!csvLgaSchools[lga]) csvLgaSchools[lga] = new Set();
            csvLgaSchools[lga].add(school);
        });
        // Convert sets to sorted arrays
        const newLgaSchools = {};
        Object.keys(csvLgaSchools).forEach(lga => {
            newLgaSchools[lga] = Array.from(csvLgaSchools[lga]).sort();
        });
        // Overwrite global lagosStateData with only imported data (remove all previous keys)
        Object.keys(lagosStateData).forEach(key => { delete lagosStateData[key]; });
        Object.assign(lagosStateData, newLgaSchools);
        // Persist lagosStateData to localStorage
        try {
            localStorage.setItem('lagosStateData', JSON.stringify(lagosStateData));
        } catch (e) {
            console.error('Error saving lagosStateData to localStorage:', e);
        }
        // --- PATCH: POST lagosStateData as { lagosStateData } to backend for MongoDB persistence ---
        try {
            await fetch('/api/lgas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ lagosStateData })
            });
            console.log('LGA/school mapping saved to backend.');
        } catch (err) {
            console.error('Failed to save LGA/school mapping to backend:', err);
        }
        // Update dropdowns to only show imported LGAs and schools
        loadLocalGovernments();
        document.getElementById('schoolName').innerHTML = '<option value="">Select LGA first</option>';
        document.getElementById('schoolName').disabled = true;
        // Do NOT import records or update dashboard/records table
        document.getElementById('csvUploadMsg').style.color = 'var(--lagos-green)';
        document.getElementById('csvUploadMsg').textContent = `Imported ${Object.keys(newLgaSchools).length} LGAs from CSV. Use the form to add new audits.`;
        setTimeout(()=>{document.getElementById('csvUploadMsg').textContent='';}, 4000);
    };
    reader.readAsText(file);
}

// Update loadLocalGovernments to only use lagosStateData (no old LGAs)
function loadLocalGovernments() {
    const localGovDropdown = document.getElementById('localGov');
    const lgas = Object.keys(lagosStateData).sort();
    localGovDropdown.innerHTML = '<option value="">Select Local Government</option>';
    lgas.forEach(lga => {
        const option = document.createElement('option');
        option.value = lga;
        option.textContent = lga;
        localGovDropdown.appendChild(option);
    });
}

// CSV parsing function
function parseCSV(text) {
    const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
    if (lines.length < 2) return { error: 'CSV must have a header and at least one data row.' };
    // Parse header
    const headerLine = lines[0];
    const headers = [];
    let col = '', inQuotes = false;
    for (let i = 0; i < headerLine.length; i++) {
        const char = headerLine[i];
        if (char === '"') inQuotes = !inQuotes;
        else if (char === ',' && !inQuotes) { headers.push(col.trim()); col = ''; }
        else col += char;
    }
    headers.push(col.trim());
    // Parse rows
    const data = [];
    for (let l = 1; l < lines.length; l++) {
        const row = {};
        let val = '', inQuotes = false, colIdx = 0;
        const line = lines[l];
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') inQuotes = !inQuotes;
            else if (char === ',' && !inQuotes) { row[headers[colIdx++]] = val.replace(/^"|"$/g, '').trim(); val = ''; }
            else val += char;
        }
        row[headers[colIdx]] = val.replace(/^"|"$/g, '').trim();
        // Only add row if at least one field is non-empty
        if (Object.values(row).some(v => v && v.length > 0)) data.push(row);
    }
    return { data };
}

// --- PATCH: Persist auditData to localStorage and load on app start ---
function saveData() {
    try {
        localStorage.setItem('auditData', JSON.stringify(auditData));
    } catch (e) {
        console.error('Error saving auditData to localStorage:', e);
    }
}

function loadData() {
    try {
        const saved = localStorage.getItem('auditData');
        if (saved) {
            auditData = JSON.parse(saved);
        } else {
            auditData = [];
        }
    } catch (e) {
        auditData = [];
        console.error('Error loading auditData from localStorage:', e);
    }
}

// --- PATCH: Render auditData into records table with pagination and actions ---
function loadRecords(page = 1, pageSize = 10) {
    // Ensure auditData is loaded
    if (!Array.isArray(auditData)) auditData = [];
    const table = document.getElementById('recordsTable');
    if (!table) return;
    // Pagination
    const total = auditData.length;
    const totalPages = Math.ceil(total / pageSize) || 1;
    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const pageData = auditData.slice(start, end);
    // Render rows
    if (pageData.length === 0) {
        table.innerHTML = '<tr><td colspan="10" style="text-align:center;padding:40px;color:#6b7280;">No records found</td></tr>';
    } else {
        table.innerHTML = pageData.map(audit => `
            <tr>
                <td><input type="checkbox" data-id="${audit.id}"></td>
                <td>${audit.schoolName || ''}</td>
                <td>${audit.localGov || ''}</td>
                <td>${audit.timestamp ? new Date(audit.timestamp).toLocaleString() : ''}</td>
                <td>${audit.principalName || ''}</td>
                <td>${audit.totalTeachers || 0}</td>
                <td>${audit.totalStudents || 0}</td>
                <td><span class="sync-status ${audit.synced ? 'synced' : 'pending'}">${audit.synced ? 'Synced' : 'Pending'}</span></td>
                <td>
                    ${(audit.photos && audit.photos.length) ? audit.photos.map(filename =>
                        `<a href="${getImageUrl(filename)}" target="_blank" style="margin-right:4px;display:inline-block;vertical-align:middle;">
                            <img src="${getImageUrl(filename)}" alt="Photo" style="width:40px;height:40px;object-fit:cover;border-radius:6px;border:1px solid #e5e7eb;" onerror="this.style.display='none'">
                        </a>`
                    ).join('') : '<span style="color:#aaa;font-size:13px;">No photo</span>'}
                </td>
                <td>
                    <button class="btn btn-secondary" style="width:auto;padding:4px 10px;font-size:13px;" onclick="editRecord(${audit.id})">Edit</button>
                    <button class="btn btn-secondary" style="width:auto;padding:4px 10px;font-size:13px;margin-left:4px;background:var(--lagos-red);border-color:var(--lagos-yellow);" onclick="deleteRecord(${audit.id})">Delete</button>
                </td>
            </tr>
        `).join('');
    }
    // Pagination controls
    const controls = document.getElementById('paginationControls');
    if (controls) {
        let html = '';
        if (totalPages > 1) {
            html += `<button onclick="loadRecords(${page - 1}, ${pageSize})" ${page === 1 ? 'disabled' : ''}>Prev</button> `;
            html += `Page ${page} of ${totalPages} `;
            html += `<button onclick="loadRecords(${page + 1}, ${pageSize})" ${page === totalPages ? 'disabled' : ''}>Next</button>`;
        }
        controls.innerHTML = html;
    }
    // Select all checkbox logic
    const selectAll = document.getElementById('selectAllCheckbox');
    if (selectAll) {
        selectAll.checked = false;
        selectAll.onclick = function() {
            const checkboxes = table.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(cb => cb.checked = selectAll.checked);
        };
    }
}

// --- PATCH: Backend persistence for audits ---
// On app load, fetch audits from backend and update auditData/localStorage
async function fetchAuditsFromBackend() {
    try {
        const response = await fetch('/api/audits');
        if (response.ok) {
            const audits = await response.json();
            if (Array.isArray(audits)) {
                auditData = audits;
                saveData();
                loadRecords();
                updateDashboard && updateDashboard();
            }
        }
    } catch (e) {
        console.warn('Could not fetch audits from backend:', e);
    }
}

// On app load, fetch audits from backend after login/session restore
(function patchAuditBackendLoad() {
    const origLoadData = window.loadData;
    window.loadData = function() {
        origLoadData && origLoadData();
        fetchAuditsFromBackend();
    };
})();

// Save audit to backend on add/edit
async function saveAudit(event) {
    event.preventDefault();
    if (uploadedFiles.length > 5) {
        alert('You can only upload up to 5 photos.');
        return;
    }
    if (!confirm('Are you sure you want to save this audit?')) {
        return;
    }
    const form = document.getElementById('auditForm');
    const editId = form.getAttribute('data-edit-id');
    let audit;
    // Upload images to backend first
    const photoNames = [];
    for (const file of uploadedFiles) {
        if (file.data && file.name) {
            let base64Data = file.data;
            if (base64Data.startsWith('data:')) {
                base64Data = base64Data.split(',')[1];
            }
            await fetch('/api/photo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ filename: file.name, data: base64Data, type: file.type || 'image/jpeg' })
            });
            photoNames.push(file.name);
        }
    }
    if (editId) {
        // Edit mode: update existing audit
        const idx = auditData.findIndex(a => a.id == editId);
        if (idx === -1) return alert('Audit not found.');
        audit = auditData[idx];
        audit.schoolName = document.getElementById('schoolName').value;
        audit.localGov = document.getElementById('localGov').value;
        audit.schoolAddress = document.getElementById('schoolAddress').value;
        audit.latitude = parseFloat(document.getElementById('latitude').value) || null;
        audit.longitude = parseFloat(document.getElementById('longitude').value) || null;
        audit.principalName = document.getElementById('principalName').value;
        audit.totalTeachers = parseInt(document.getElementById('totalTeachers').value) || 0;
        audit.totalStudents = parseInt(document.getElementById('totalStudents').value) || 0;
        audit.facilityCondition = document.getElementById('facilityCondition').value;
        audit.additionalNotes = document.getElementById('additionalNotes').value;
        audit.photos = [...photoNames];
        audit.synced = false;
        audit.timestamp = new Date().toISOString();
        auditData[idx] = audit;
        // PATCH: Update in backend
        await fetch(`/api/audits/${audit.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(audit)
        });
    } else {
        // New audit
        audit = {
            id: Date.now(),
            schoolName: document.getElementById('schoolName').value,
            localGov: document.getElementById('localGov').value,
            schoolAddress: document.getElementById('schoolAddress').value,
            latitude: parseFloat(document.getElementById('latitude').value) || null,
            longitude: parseFloat(document.getElementById('longitude').value) || null,
            principalName: document.getElementById('principalName').value,
            totalTeachers: parseInt(document.getElementById('totalTeachers').value) || 0,
            totalStudents: parseInt(document.getElementById('totalStudents').value) || 0,
            facilityCondition: document.getElementById('facilityCondition').value,
            additionalNotes: document.getElementById('additionalNotes').value,
            photos: [...photoNames],
            auditor: currentUser,
            timestamp: new Date().toISOString(),
            synced: false
        };
        auditData.push(audit);
        // PATCH: Save to backend
        await fetch('/api/audits', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(audit)
        });
    }
    saveData();
    updateDashboard();
    loadRecords();
    // Reset edit mode
    form.removeAttribute('data-edit-id');
    alert('Audit saved successfully!');
    // Reset form
    event.target.reset();
    uploadedFiles = [];
    document.getElementById('uploadedFiles').innerHTML = '';
    document.getElementById('localGov').value = '';
    document.getElementById('schoolName').innerHTML = '<option value="">Select LGA first</option>';
    document.getElementById('schoolName').disabled = true;
    updateDashboard();
    document.querySelector('#auditForm button[type="submit"]').textContent = "💾 Save Audit";
}

// PATCH: Delete audit from backend
async function deleteRecord(id) {
    if (!confirm('Are you sure you want to delete this audit?')) return;
    const idx = auditData.findIndex(a => a.id == id);
    if (idx === -1) return alert('Audit not found.');
    // Remove from backend
    await fetch(`/api/audits/${id}`, { method: 'DELETE' });
    auditData.splice(idx, 1);
    saveData();
    loadRecords();
    updateDashboard && updateDashboard();
}

// --- PATCH: Bulk delete and bulk edit for records page ---
function getSelectedRecordIds() {
    const checkboxes = document.querySelectorAll('#recordsTable input[type="checkbox"]:checked');
    return Array.from(checkboxes).map(cb => cb.getAttribute('data-id'));
}

async function bulkDeleteRecords() {
    const ids = getSelectedRecordIds();
    if (ids.length === 0) {
        alert('Select at least one record to delete.');
        return;
    }
    if (!confirm(`Are you sure you want to delete ${ids.length} selected record(s)?`)) return;
    for (const id of ids) {
        await fetch(`/api/audits/${id}`, { method: 'DELETE' });
        const idx = auditData.findIndex(a => a.id == id);
        if (idx !== -1) auditData.splice(idx, 1);
    }
    saveData();
    loadRecords();
    if (typeof updateDashboard === 'function') updateDashboard();
}

function bulkEditRecords() {
    const ids = getSelectedRecordIds();
    if (ids.length === 0) {
        alert('Select at least one record to edit.');
        return;
    }
    if (ids.length > 1) {
        alert('Bulk edit only supports editing one record at a time. Please select only one record.');
        return;
    }
    // Trigger edit for the first selected record
    editRecord(ids[0]);
}

// --- PATCH: Update dashboard stat cards and recent audits table from auditData ---
function updateDashboard() {
    // Defensive: ensure auditData is loaded
    if (!Array.isArray(auditData)) auditData = [];
    // Stat cards
    const totalAudits = auditData.length;
    const pendingSync = auditData.filter(a => !a.synced).length;
    // Completed today: audits with timestamp from today
    const today = new Date();
    const completedToday = auditData.filter(audit => {
        if (!audit.timestamp) return false;
        const d = new Date(audit.timestamp);
        return d.getFullYear() === today.getFullYear() &&
               d.getMonth() === today.getMonth() &&
               d.getDate() === today.getDate();
    }).length;
    document.getElementById('totalAudits').textContent = totalAudits;
    document.getElementById('pendingSync').textContent = pendingSync;
    document.getElementById('completedToday').textContent = completedToday;
    // Recent audits table (latest 5, most recent first)
    const recent = [...auditData].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 5);
    const table = document.getElementById('recentAuditsTable');
    if (!table) return;
    if (recent.length === 0) {
        table.innerHTML = '<tr><td colspan="4" style="text-align:center;padding:40px;color:#6b7280;">No audits completed yet</td></tr>';
    } else {
        table.innerHTML = recent.map(audit => `
            <tr>
                <td>${audit.schoolName || ''}</td>
                <td>${audit.localGov || ''}</td>
                <td>${audit.timestamp ? new Date(audit.timestamp).toLocaleString() : ''}</td>
                <td><span class="sync-status ${audit.synced ? 'synced' : 'pending'}">${audit.synced ? 'Synced' : 'Pending'}</span></td>
            </tr>
        `).join('');
    }
}

// --- PATCH: Update Sync section pending count from auditData ---
function updateSyncSection() {
    if (!Array.isArray(auditData)) auditData = [];
    const pending = auditData.filter(a => !a.synced).length;
    const el = document.getElementById('pendingSyncCount');
    if (el) el.textContent = pending;
}
// Patch updateDashboard to also update sync section
const origUpdateDashboard = window.updateDashboard;
window.updateDashboard = function() {
    origUpdateDashboard && origUpdateDashboard();
    updateSyncSection && updateSyncSection();
};

// Also call updateSyncSection after loadRecords, saveAudit, deleteRecord, bulkDeleteRecords, and after syncing audits if not already

// --- PATCH: Edit record from records page ---
function editRecord(id) {
    const audit = auditData.find(a => a.id == id);
    if (!audit) return alert('Audit not found.');
    // Show audit form section
    showSection('audit');
    // Populate form fields
    document.getElementById('localGov').value = audit.localGov || '';
    loadSchools();
    document.getElementById('schoolName').value = audit.schoolName || '';
    document.getElementById('schoolAddress').value = audit.schoolAddress || '';
    document.getElementById('latitude').value = audit.latitude || '';
    document.getElementById('longitude').value = audit.longitude || '';
    document.getElementById('principalName').value = audit.principalName || '';
    document.getElementById('totalTeachers').value = audit.totalTeachers || '';
    document.getElementById('totalStudents').value = audit.totalStudents || '';
    document.getElementById('facilityCondition').value = audit.facilityCondition || '';
    document.getElementById('additionalNotes').value = audit.additionalNotes || '';
    // Photos: preview existing images in edit mode
    uploadedFiles = [];
    const uploadedFilesDiv = document.getElementById('uploadedFiles');
    uploadedFilesDiv.innerHTML = '';
    if (audit.photos && Array.isArray(audit.photos) && audit.photos.length > 0) {
        audit.photos.forEach(filename => {
            const fileDiv = document.createElement('div');
            fileDiv.className = 'file-preview';
            fileDiv.innerHTML = `
                <img src="${getImageUrl(filename)}" alt="${filename}" style="width:100%;height:100%;object-fit:cover;">
                <a href="${getImageUrl(filename)}" target="_blank" class="file-download" title="View Full Image" style="position:absolute;bottom:5px;right:5px;background:rgba(30,64,175,0.8);color:#fff;padding:2px 8px;border-radius:6px;">🔍</a>
            `;
            uploadedFilesDiv.appendChild(fileDiv);
        });
    }
    document.getElementById('fileInput').disabled = false;
    document.getElementById('photoLimitMsg').style.display = 'none';
    const form = document.getElementById('auditForm');
    form.setAttribute('data-edit-id', audit.id);
    document.querySelector('#auditForm button[type="submit"]').textContent = '✏️ Update Audit';
}

// --- PATCH: Sync Now button logic ---
async function syncData() {
    // Find all unsynced audits
    const unsynced = auditData.filter(a => !a.synced);
    if (unsynced.length === 0) {
        alert('No pending records to sync.');
        return;
    }
    let success = 0, fail = 0;
    for (const audit of unsynced) {
        try {
            // Mark as synced and update backend
            audit.synced = true;
            await fetch(`/api/audits/${audit.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(audit)
            });
            success++;
        } catch (e) {
            fail++;
        }
    }
    saveData();
    updateDashboard();
    loadRecords();
    updateSyncSection();
    // Log result
    const log = document.getElementById('syncLog');
    if (log) {
        const msg = document.createElement('div');
        msg.style.margin = '10px 0';
        msg.style.color = (fail === 0) ? 'var(--lagos-green)' : 'var(--lagos-red)';
        msg.textContent = `Sync complete: ${success} record(s) synced${fail ? ', ' + fail + ' failed' : ''}.`;
        log.prepend(msg);
    }
    alert(`Sync complete: ${success} record(s) synced${fail ? ', ' + fail + ' failed' : ''}.`);
}

// Connection status function
function updateConnectionStatus() {
    const statusDot = document.getElementById('connectionStatus');
    const statusText = document.getElementById('connectionText');

    if (navigator.onLine) {
        if (statusDot) {
            statusDot.className = 'status-dot';
        }
        if (statusText) {
            statusText.textContent = 'Online';
        }
    } else {
        if (statusDot) {
            statusDot.className = 'status-dot offline';
        }
        if (statusText) {
            statusText.textContent = 'Offline';
        }
    }
}

// Listen for online/offline events
window.addEventListener('online', updateConnectionStatus);
window.addEventListener('offline', updateConnectionStatus);

// --- PATCH: Display images in records table and audit form if available ---
// Helper to get image URL from filename
function getImageUrl(filename) {
    return `/api/photo/${encodeURIComponent(filename)}`;
}
// --- PATCH: Edit record from records page ---
function editRecord(id) {
    const audit = auditData.find(a => a.id == id);
    if (!audit) return alert('Audit not found.');
    showSection('audit');
    document.getElementById('localGov').value = audit.localGov || '';
    loadSchools();
    document.getElementById('schoolName').value = audit.schoolName || '';
    document.getElementById('schoolAddress').value = audit.schoolAddress || '';
    document.getElementById('latitude').value = audit.latitude || '';
    document.getElementById('longitude').value = audit.longitude || '';
    document.getElementById('principalName').value = audit.principalName || '';
    document.getElementById('totalTeachers').value = audit.totalTeachers || '';
    document.getElementById('totalStudents').value = audit.totalStudents || '';
    document.getElementById('facilityCondition').value = audit.facilityCondition || '';
    document.getElementById('additionalNotes').value = audit.additionalNotes || '';
    // Photos: preview existing images in edit mode
    uploadedFiles = [];
    const uploadedFilesDiv = document.getElementById('uploadedFiles');
    uploadedFilesDiv.innerHTML = '';
    if (audit.photos && Array.isArray(audit.photos) && audit.photos.length > 0) {
        audit.photos.forEach(filename => {
            const fileDiv = document.createElement('div');
            fileDiv.className = 'file-preview';
            fileDiv.innerHTML = `
                <img src="${getImageUrl(filename)}" alt="${filename}" style="width:100%;height:100%;object-fit:cover;">
                <a href="${getImageUrl(filename)}" target="_blank" class="file-download" title="View Full Image" style="position:absolute;bottom:5px;right:5px;background:rgba(30,64,175,0.8);color:#fff;padding:2px 8px;border-radius:6px;">🔍</a>
            `;
            uploadedFilesDiv.appendChild(fileDiv);
        });
    }
    document.getElementById('fileInput').disabled = false;
    document.getElementById('photoLimitMsg').style.display = 'none';
    const form = document.getElementById('auditForm');
    form.setAttribute('data-edit-id', audit.id);
    document.querySelector('#auditForm button[type="submit"]').textContent = '✏️ Update Audit';
}
// --- Survey Form Submission Logic for SILNAT, TCMATS, LORI, VOICES ---

function toggleSection(sectionId, headerId) {
    const section = document.getElementById(sectionId);
    const header = document.getElementById(headerId);
    if (section && header) {
        const isHidden = section.style.display === 'none';
        section.style.display = isHidden ? 'block' : 'none';
        const headerText = header.innerText;
        if (isHidden) {
            header.innerText = headerText.replace('▶️', '🔽');
        } else {
            header.innerText = headerText.replace('🔽', '▶️');
        }
    }
}

// Function to handle SILNAT Institution Type change
function handleSchoolComplexChange() {
    const schoolComplexValue = document.querySelector('input[name="school_complex"]:checked').value;
    const otherSchoolsWrapper = document.getElementById('other_schools_in_complex_wrapper');
    if (schoolComplexValue === 'yes') {
        otherSchoolsWrapper.style.display = 'block';
    } else {
        otherSchoolsWrapper.style.display = 'none';
    }
}

function handlePerimeterFenceChange() {
    const perimeterFenceValue = document.querySelector('input[name="perimeter_fence"]:checked').value;
    const perimeterFenceStateWrapper = document.getElementById('perimeter_fence_state_wrapper');
    const schoolPerimeterWrapper = document.getElementById('school_perimeter_wrapper');
    if (perimeterFenceValue === 'yes') {
        perimeterFenceStateWrapper.style.display = 'block';
        schoolPerimeterWrapper.style.display = 'none';
    } else {
        perimeterFenceStateWrapper.style.display = 'none';
        schoolPerimeterWrapper.style.display = 'block';
    }
}

function handleSilnatInstitutionTypeChange() {
    const institutionType = document.getElementById('silnat_a_institution_type').value;

    // Hide all conditional groups first
    const allConditionalGroups = document.querySelectorAll('#silnatForm .conditional-group');
    allConditionalGroups.forEach(group => group.style.display = 'none');

    // Hide all conditional sub-groups (like 'other qualification')
    const allConditionalSubGroups = document.querySelectorAll('#silnatForm .conditional-sub-group');
    allConditionalSubGroups.forEach(subGroup => subGroup.style.display = 'none');

    // Selectors for main content wrappers that should become visible after type selection
    // These will be expanded as the form is built.
    const htBioWrapper = document.getElementById('silnat_a_ht_bio_data_wrapper');
    const esBioWrapper = document.getElementById('silnat_a_es_bio_data_wrapper');
    // const sectionBWrapper = document.getElementById('silnat_section_b_wrapper');
    // const sectionCWrapper = document.getElementById('silnat_section_c_wrapper');
    // const sectionDWrapper = document.getElementById('silnat_section_d_wrapper');
    // const respondentWrapper = document.getElementById('silnat_respondent_details_wrapper');
    // const officialUseWrapper = document.getElementById('silnat_official_use_wrapper');
    // const fileUploadWrapper = document.getElementById('silnat_file_upload_wrapper');


    if (!institutionType) { // No type selected, hide everything specific
        if(htBioWrapper) htBioWrapper.style.display = 'none';
        if(esBioWrapper) esBioWrapper.style.display = 'none';
        // if(sectionBWrapper) sectionBWrapper.style.display = 'none';
        // ... hide other main wrappers ...
        return;
    }

    // Show relevant bio data wrapper
    if (institutionType === 'regular_school' || institutionType === 'special_school' || institutionType === 'home_economics_centre' || institutionType === 'mini_resource_centre') {
        if(htBioWrapper) htBioWrapper.style.display = 'block';
        if(esBioWrapper) esBioWrapper.style.display = 'none'; // Ensure other is hidden
        clearEducationSecretaryBioData();
    } else if (institutionType === 'lgea_secretariat') {
        if(esBioWrapper) esBioWrapper.style.display = 'block';
        if(htBioWrapper) htBioWrapper.style.display = 'none'; // Ensure other is hidden
        clearHeadTeacherBioData();
    }

    // Show other main section wrappers (will be uncommented/added as form grows)
    // if(sectionBWrapper) sectionBWrapper.style.display = 'block';
    // if(sectionCWrapper) sectionCWrapper.style.display = 'block';
    // if(sectionDWrapper) sectionDWrapper.style.display = 'block';
    // if(respondentWrapper) respondentWrapper.style.display = 'block';
    // if(officialUseWrapper) officialUseWrapper.style.display = 'block';
    // if(fileUploadWrapper) fileUploadWrapper.style.display = 'block';


    // Handle sub-group for "Other" qualification for HT (if HT section is visible)
    if (htBioWrapper && htBioWrapper.style.display === 'block') {
        const htQualificationSelect = document.getElementById('silnat_a_ht_highest_qualification');
        const htOtherQualGroup = document.getElementById('silnat_a_ht_highest_qualification_other_group');
        const htOtherQualInput = document.getElementById('silnat_a_ht_highest_qualification_other');
        if (htQualificationSelect && htQualificationSelect.value === 'others') {
            if(htOtherQualGroup) htOtherQualGroup.style.display = 'block';
        } else {
            if(htOtherQualGroup) htOtherQualGroup.style.display = 'none';
            if(htOtherQualInput) htOtherQualInput.value = '';
        }
    }

    // Handle sub-group for "Other" qualification for ES (if ES section is visible)
     if (esBioWrapper && esBioWrapper.style.display === 'block') {
        const esQualificationSelect = document.getElementById('silnat_a_es_highest_qualification');
        const esOtherQualGroup = document.getElementById('silnat_a_es_highest_qualification_other_group');
        const esOtherQualInput = document.getElementById('silnat_a_es_highest_qualification_other');
        if (esQualificationSelect && esQualificationSelect.value === 'others') {
            if(esOtherQualGroup) esOtherQualGroup.style.display = 'block';
        } else {
            if(esOtherQualGroup) esOtherQualGroup.style.display = 'none';
            if(esOtherQualInput) esOtherQualInput.value = '';
        }
    }
}

// Helper functions to clear data from hidden sections
function clearHeadTeacherBioData() {
    const fieldsToClearIds = ['silnat_a_ht_name', 'silnat_a_ht_contact', 'silnat_a_ht_highest_qualification_other'];
    fieldsToClearIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    document.querySelectorAll('input[name="silnat_a_ht_gender"]').forEach(rb => rb.checked = false);
    document.querySelectorAll('input[name="silnat_a_ht_marital_status"]').forEach(rb => rb.checked = false);
    const qualSelect = document.getElementById('silnat_a_ht_highest_qualification');
    if (qualSelect) qualSelect.value = '';
    const expSelect = document.getElementById('silnat_a_ht_years_experience');
    if (expSelect) expSelect.value = '';
    const otherGroup = document.getElementById('silnat_a_ht_highest_qualification_other_group');
    if(otherGroup) otherGroup.style.display = 'none';
}

function clearEducationSecretaryBioData() {
    const fieldsToClearIds = ['silnat_a_es_name', 'silnat_a_es_contact', 'silnat_a_es_highest_qualification_other'];
    fieldsToClearIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    document.querySelectorAll('input[name="silnat_a_es_gender"]').forEach(rb => rb.checked = false);
    document.querySelectorAll('input[name="silnat_a_es_marital_status"]').forEach(rb => rb.checked = false);
    const qualSelect = document.getElementById('silnat_a_es_highest_qualification');
    if (qualSelect) qualSelect.value = '';
    const expSelect = document.getElementById('silnat_a_es_years_experience');
    if (expSelect) expSelect.value = '';
    const otherGroup = document.getElementById('silnat_a_es_highest_qualification_other_group');
    if(otherGroup) otherGroup.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
    // Initial call to set form state based on default selection (if any)
    // handleSilnatInstitutionTypeChange(); // Not calling on load to keep form initially clean

    // Attach event listeners to qualification dropdowns to handle "Other" field visibility
    const htQualificationSelect = document.getElementById('silnat_a_ht_highest_qualification');
    if(htQualificationSelect) {
        htQualificationSelect.addEventListener('change', function() {
            const otherGroup = document.getElementById('silnat_a_ht_highest_qualification_other_group');
            const otherInput = document.getElementById('silnat_a_ht_highest_qualification_other');
            if (this.value === 'others') {
                if(otherGroup) otherGroup.style.display = 'block';
            } else {
                if(otherGroup) otherGroup.style.display = 'none';
                if(otherInput) otherInput.value = '';
            }
        });
    }

    const esQualificationSelect = document.getElementById('silnat_a_es_highest_qualification');
    if(esQualificationSelect) {
        esQualificationSelect.addEventListener('change', function() {
            const otherGroup = document.getElementById('silnat_a_es_highest_qualification_other_group');
            const otherInput = document.getElementById('silnat_a_es_highest_qualification_other');
            if (this.value === 'others') {
                if(otherGroup) otherGroup.style.display = 'block';
            } else {
                if(otherGroup) otherGroup.style.display = 'none';
                if(otherInput) otherInput.value = '';
            }
        });
    }

    // Event listeners for SILNAT teacher count auto-calculation
    const maleTeachersInput = document.getElementById('silnat_teachers_male');
    const femaleTeachersInput = document.getElementById('silnat_teachers_female');

    if (maleTeachersInput) {
        maleTeachersInput.addEventListener('input', updateSilnatTotalTeachers);
    }
    if (femaleTeachersInput) {
        femaleTeachersInput.addEventListener('input', updateSilnatTotalTeachers);
    }
    // Initialize total teachers count in case of pre-filled values (e.g. form edit)
    // updateSilnatTotalTeachers(); // Call if needed on form load/edit

    // Event listeners for SILNAT non-teaching staff count auto-calculation
    const maleNonTeachingInput = document.getElementById('silnat_non_teaching_male');
    const femaleNonTeachingInput = document.getElementById('silnat_non_teaching_female');

    if (maleNonTeachingInput) {
        maleNonTeachingInput.addEventListener('input', updateSilnatTotalNonTeachingStaff);
    }
    if (femaleNonTeachingInput) {
        femaleNonTeachingInput.addEventListener('input', updateSilnatTotalNonTeachingStaff);
    }

    // Event listeners for SILNAT pupil count auto-calculation
    const malePupilsInput = document.getElementById('silnat_pupils_male');
    const femalePupilsInput = document.getElementById('silnat_pupils_female');

    if (malePupilsInput) {
        malePupilsInput.addEventListener('input', updateSilnatTotalPupils);
    }
    if (femalePupilsInput) {
        femalePupilsInput.addEventListener('input', updateSilnatTotalPupils);
    }

    // Event listeners for SILNAT ECCDE pupil count auto-calculation
    const malePupilsEccdeInput = document.getElementById('silnat_pupils_eccde_male');
    const femalePupilsEccdeInput = document.getElementById('silnat_pupils_eccde_female');
    if (malePupilsEccdeInput) { malePupilsEccdeInput.addEventListener('input', updateSilnatTotalPupilsEccde); }
    if (femalePupilsEccdeInput) { femalePupilsEccdeInput.addEventListener('input', updateSilnatTotalPupilsEccde); }

    // Event listeners for SILNAT Primary pupil count auto-calculation
    const malePupilsPrimaryInput = document.getElementById('silnat_pupils_primary_male');
    const femalePupilsPrimaryInput = document.getElementById('silnat_pupils_primary_female');
    if (malePupilsPrimaryInput) { malePupilsPrimaryInput.addEventListener('input', updateSilnatTotalPupilsPrimary); }
    if (femalePupilsPrimaryInput) { femalePupilsPrimaryInput.addEventListener('input', updateSilnatTotalPupilsPrimary); }

    // Event listeners for SILNAT Special Learners pupil count auto-calculation
    const malePupilsSpecialInput = document.getElementById('silnat_pupils_special_male');
    const femalePupilsSpecialInput = document.getElementById('silnat_pupils_special_female');
    if (malePupilsSpecialInput) { malePupilsSpecialInput.addEventListener('input', updateSilnatTotalPupilsSpecial); }
    if (femalePupilsSpecialInput) { femalePupilsSpecialInput.addEventListener('input', updateSilnatTotalPupilsSpecial); }
});

// Function to update total teachers for SILNAT form
function updateSilnatTotalTeachers() {
    const maleTeachersInput = document.getElementById('silnat_teachers_male');
    const femaleTeachersInput = document.getElementById('silnat_teachers_female');
    const totalTeachersInput = document.getElementById('silnat_teachers_total');

    if (maleTeachersInput && femaleTeachersInput && totalTeachersInput) {
        const maleCount = parseInt(maleTeachersInput.value, 10) || 0;
        const femaleCount = parseInt(femaleTeachersInput.value, 10) || 0;

        totalTeachersInput.value = maleCount + femaleCount;
    }
}

// Function to update total non-teaching staff for SILNAT form
function updateSilnatTotalNonTeachingStaff() {
    const maleNonTeachingInput = document.getElementById('silnat_non_teaching_male');
    const femaleNonTeachingInput = document.getElementById('silnat_non_teaching_female');
    const totalNonTeachingInput = document.getElementById('silnat_non_teaching_total');

    if (maleNonTeachingInput && femaleNonTeachingInput && totalNonTeachingInput) {
        const maleCount = parseInt(maleNonTeachingInput.value, 10) || 0;
        const femaleCount = parseInt(femaleNonTeachingInput.value, 10) || 0;

        totalNonTeachingInput.value = maleCount + femaleCount;
    }
}

// Function to update total pupils for SILNAT form
function updateSilnatTotalPupils() {
    const malePupilsInput = document.getElementById('silnat_pupils_male');
    const femalePupilsInput = document.getElementById('silnat_pupils_female');
    const totalPupilsInput = document.getElementById('silnat_pupils_total');

    if (malePupilsInput && femalePupilsInput && totalPupilsInput) {
        const maleCount = parseInt(malePupilsInput.value, 10) || 0;
        const femaleCount = parseInt(femalePupilsInput.value, 10) || 0;

        totalPupilsInput.value = maleCount + femaleCount;
    }
}

function updateSilnatTotalPupilsEccde() {
    const maleInput = document.getElementById('silnat_pupils_eccde_male');
    const femaleInput = document.getElementById('silnat_pupils_eccde_female');
    const totalInput = document.getElementById('silnat_pupils_eccde_total');
    if (maleInput && femaleInput && totalInput) {
        const maleCount = parseInt(maleInput.value, 10) || 0;
        const femaleCount = parseInt(femaleInput.value, 10) || 0;
        totalInput.value = maleCount + femaleCount;
    }
}

function updateSilnatTotalPupilsPrimary() {
    const maleInput = document.getElementById('silnat_pupils_primary_male');
    const femaleInput = document.getElementById('silnat_pupils_primary_female');
    const totalInput = document.getElementById('silnat_pupils_primary_total');
    if (maleInput && femaleInput && totalInput) {
        const maleCount = parseInt(maleInput.value, 10) || 0;
        const femaleCount = parseInt(femaleInput.value, 10) || 0;
        totalInput.value = maleCount + femaleCount;
    }
}

function updateSilnatTotalPupilsSpecial() {
    const maleInput = document.getElementById('silnat_pupils_special_male');
    const femaleInput = document.getElementById('silnat_pupils_special_female');
    const totalInput = document.getElementById('silnat_pupils_special_total');
    if (maleInput && femaleInput && totalInput) {
        const maleCount = parseInt(maleInput.value, 10) || 0;
        const femaleCount = parseInt(femaleInput.value, 10) || 0;
        totalInput.value = maleCount + femaleCount;
    }
}


// Helper: Convert FileList to array and resize images (returns array of base64 strings)
async function processFiles(input, maxCount) {
    const files = Array.from(input.files).slice(0, maxCount);
    const images = [];
    for (const file of files) {
        if (!file.type.startsWith('image/')) continue;
        const dataUrl = await resizeImage(file, 600, 0.6); // Use your resizeImage util
        images.push(dataUrl);
    }
    return images;
}

// --- SILNAT ---
async function submitSilnat(event) {
    event.preventDefault();
    const form = document.getElementById('silnatForm');
    const feedback = document.getElementById('silnat_feedback');
    feedback.textContent = '';

    const institutionType = document.getElementById('silnat_a_institution_type').value;
    if (!institutionType) {
        feedback.style.color = 'var(--lagos-red)';
        feedback.textContent = 'Please select an Institution Type.';
        return;
    }

    // Basic validation: Check all visible required inputs in the form
    const visibleRequiredInputs = form.querySelectorAll('input[required]:not([style*="display: none"]):not([disabled]), select[required]:not([style*="display: none"]):not([disabled]), textarea[required]:not([style*="display: none"]):not([disabled])');
    for (const input of visibleRequiredInputs) {
        // Check if the input itself is within a visible conditional group
        let parent = input.closest('.conditional-group');
        let isVisibleConditional = true; // Assume visible if not in a conditional group
        if (parent) {
            isVisibleConditional = (parent.style.display !== 'none');
        }

        if (isVisibleConditional && !input.value.trim()) {
            // Try to get label text more reliably
            let labelText = `Field with ID '${input.id}'`;
            const labelElement = form.querySelector(`label[for="${input.id}"]`);
            if (labelElement) {
                labelText = labelElement.textContent.replace('*','').trim();
            } else { // Try parent label if input is radio/checkbox
                 const parentLabel = input.closest('label');
                 if(parentLabel) labelText = parentLabel.textContent.replace('*','').trim();
            }

            feedback.style.color = 'var(--lagos-red)';
            feedback.textContent = `Please fill the required field: ${labelText}.`;
            input.focus();
            return;
        }

        if (input.type === 'radio' && isVisibleConditional) {
            const radioGroupName = input.name;
            const radioGroup = form.elements[radioGroupName];
            let groupIsVisible = true;
            let radioParent = input.closest('.conditional-group');
            if(radioParent && radioParent.style.display === 'none') {
                groupIsVisible = false;
            }

            if (groupIsVisible && radioGroup && radioGroup.value === '') {
                 // Find a label associated with the radio group
                const firstRadioInGroup = document.querySelector(`input[name="${radioGroupName}"]`);
                let groupLabelText = radioGroupName;
                if(firstRadioInGroup){
                    const parentFormGroup = firstRadioInGroup.closest('.form-group');
                    if(parentFormGroup){
                        const labelElem = parentFormGroup.querySelector('label:not(.radio-inline)');
                        if(labelElem) groupLabelText = labelElem.textContent.replace('*','').trim();
                    }
                }
                 feedback.style.color = 'var(--lagos-red)';
                 feedback.textContent = `Please make a selection for: ${groupLabelText}.`;
                 return;
            }
        }
    }


    feedback.textContent = 'Submitting...';
    feedback.style.color = 'var(--lagos-blue)';

    const data = {
        institution_type: institutionType,
        section_a: {},
        section_b: {},
        section_c: {},
        section_d: {},
        respondent_details: {},
        official_use: {}
    };

    // Collect Section A data
    if (institutionType === 'regular_school' || institutionType === 'special_school' || institutionType === 'home_economics_centre' || institutionType === 'mini_resource_centre') {
        const htBioWrapper = document.getElementById('silnat_a_ht_bio_data_wrapper');
        if (htBioWrapper && htBioWrapper.style.display !== 'none') {
            data.section_a.head_teacher_name = document.getElementById('silnat_a_ht_name')?.value.trim();
            data.section_a.contact_number = document.getElementById('silnat_a_ht_contact')?.value.trim();
            data.section_a.gender = form.elements['silnat_a_ht_gender']?.value;
            data.section_a.marital_status = form.elements['silnat_a_ht_marital_status']?.value;
            data.section_a.highest_qualification = document.getElementById('silnat_a_ht_highest_qualification')?.value;
            if (data.section_a.highest_qualification === 'others') {
                data.section_a.highest_qualification_other = document.getElementById('silnat_a_ht_highest_qualification_other')?.value.trim();
            }
            data.section_a.years_leadership_experience = document.getElementById('silnat_a_ht_years_experience')?.value;
        }
    } else if (institutionType === 'lgea_secretariat') {
        const esBioWrapper = document.getElementById('silnat_a_es_bio_data_wrapper');
        if (esBioWrapper && esBioWrapper.style.display !== 'none') {
            data.section_a.education_secretary_name = document.getElementById('silnat_a_es_name')?.value.trim();
            data.section_a.contact_number = document.getElementById('silnat_a_es_contact')?.value.trim();
            data.section_a.gender = form.elements['silnat_a_es_gender']?.value;
            data.section_a.marital_status = form.elements['silnat_a_es_marital_status']?.value;
            data.section_a.highest_qualification = document.getElementById('silnat_a_es_highest_qualification')?.value;
            if (data.section_a.highest_qualification === 'others') {
                data.section_a.highest_qualification_other = document.getElementById('silnat_a_es_highest_qualification_other')?.value.trim();
            }
            data.section_a.years_leadership_experience = document.getElementById('silnat_a_es_years_experience')?.value;
        }
    }

    // These are common fields currently structured as if they are section B, but will be part of the new section B logic
    data.section_b.institution_name_common = document.getElementById('silnat_schoolName')?.value.trim();
    data.section_b.institution_address_common = document.getElementById('silnat_schoolAddress_common')?.value.trim();
    data.section_b.location_common = document.getElementById('silnat_location_common')?.value; // Optional field
    data.section_b.local_gov_common = document.getElementById('silnat_localGov')?.value.trim();

    // Placeholder for original simple form fields - these will be replaced by detailed conditional fields
    data.section_d.infrastructure_condition_old = document.getElementById('silnat_infrastructure')?.value;
    data.section_d.leadership_structure_old = document.getElementById('silnat_leadership')?.value; // This was likely a Section A or C type question

    data.section_c.discipline_a = form.elements['discipline_a']?.value;
    data.section_c.discipline_b = form.elements['discipline_b']?.value;
    data.section_c.discipline_c = form.elements['discipline_c']?.value;
    data.section_c.discipline_d = form.elements['discipline_d']?.value;
    data.section_c.discipline_e = form.elements['discipline_e']?.value;

    data.section_c.cooperation_a = form.elements['cooperation_a']?.value;
    data.section_c.cooperation_b = form.elements['cooperation_b']?.value;
    data.section_c.cooperation_c = form.elements['cooperation_c']?.value;
    data.section_c.cooperation_d = form.elements['cooperation_d']?.value;

    data.section_c.communication_a = form.elements['communication_a']?.value;
    data.section_c.communication_b = form.elements['communication_b']?.value;
    data.section_c.communication_c = form.elements['communication_c']?.value;

    data.section_c.community_a = form.elements['community_a']?.value;
    data.section_c.community_b = form.elements['community_b']?.value;
    data.section_c.community_c = form.elements['community_c']?.value;
    data.section_c.community_d = form.elements['community_d']?.value;
    data.section_c.community_e = form.elements['community_e']?.value;

    data.section_c.supervision_a = form.elements['supervision_a']?.value;
    data.section_c.supervision_b = form.elements['supervision_b']?.value;
    data.section_c.supervision_c = form.elements['supervision_c']?.value;
    data.section_c.supervision_d = form.elements['supervision_d']?.value;
    data.section_c.supervision_e = form.elements['supervision_e']?.value;

    data.section_c.records_a = form.elements['records_a']?.value;
    data.section_c.records_b = form.elements['records_b']?.value;
    data.section_c.records_c = form.elements['records_c']?.value;
    data.section_c.records_d = form.elements['records_d']?.value;
    data.section_c.records_e = form.elements['records_e']?.value;
    data.section_c.records_f = form.elements['records_f']?.value;
    data.section_c.records_g = form.elements['records_g']?.value;
    data.section_c.records_h = form.elements['records_h']?.value;
    data.section_c.records_i = form.elements['records_i']?.value;

    data.section_c.health_a = form.elements['health_a']?.value;
    data.section_c.health_b = form.elements['health_b']?.value;
    data.section_c.health_c = form.elements['health_c']?.value;
    data.section_c.health_d = form.elements['health_d']?.value;
    data.section_c.health_e = form.elements['health_e']?.value;
    data.section_c.health_f = form.elements['health_f']?.value;

    const fileInput = document.getElementById('silnat_fileInput');
    if (fileInput && fileInput.files.length > 0) {
        data.photos = await processFiles(fileInput, 5); // processFiles is defined elsewhere
    } else {
        data.photos = [];
    }

    console.log("Submitting SILNAT Data:", JSON.stringify(data, null, 2)); // For debugging

    try {
        const res = await fetch('/api/silnat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (res.ok) {
            feedback.style.color = 'var(--lagos-green)';
            feedback.textContent = 'SILNAT survey submitted successfully!';
            form.reset();
            document.getElementById('silnat_uploadedFiles').innerHTML = '';
        } else {
            const err = await res.json();
            feedback.style.color = 'var(--lagos-red)';
            feedback.textContent = err.message || 'Submission failed.';
        }
    } catch (e) {
        feedback.style.color = 'var(--lagos-red)';
        feedback.textContent = 'Network error. Please try again.';
    }
}

// --- TCMATS ---
async function submitTcmats(event) {
    event.preventDefault();
    const form = document.getElementById('tcmatsForm');
    const feedback = document.getElementById('tcmats_feedback');
    feedback.textContent = '';
    const required = ['tcmats_teacherName','tcmats_school','tcmats_subject','tcmats_class','tcmats_observation'];
    for (const id of required) {
        if (!document.getElementById(id).value.trim()) {
            feedback.style.color = 'var(--lagos-red)';
            feedback.textContent = 'Please fill all required fields.';
            return;
        }
    }
    feedback.textContent = 'Submitting...';
    feedback.style.color = 'var(--lagos-blue)';
    const data = {
        teacherName: document.getElementById('tcmats_teacherName').value.trim(),
        school: document.getElementById('tcmats_school').value.trim(),
        subject: document.getElementById('tcmats_subject').value.trim(),
        class: document.getElementById('tcmats_class').value.trim(),
        observation: document.getElementById('tcmats_observation').value.trim(),
        evidence: await processFiles(document.getElementById('tcmats_fileInput'), 3)
    };
    try {
        const res = await fetch('/api/tcmats', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (res.ok) {
            feedback.style.color = 'var(--lagos-green)';
            feedback.textContent = 'TCMATS survey submitted successfully!';
            form.reset();
            document.getElementById('tcmats_uploadedFiles').innerHTML = '';
        } else {
            const err = await res.json();
            feedback.style.color = 'var(--lagos-red)';
            feedback.textContent = err.message || 'Submission failed.';
        }
    } catch (e) {
        feedback.style.color = 'var(--lagos-red)';
        feedback.textContent = 'Network error. Please try again.';
    }
}

// --- LORI ---
async function submitLori(event) {
    event.preventDefault();
    const form = document.getElementById('loriForm');
    const feedback = document.getElementById('lori_feedback');
    feedback.textContent = '';
    const required = ['lori_assessorName','lori_teacherName','lori_school','lori_class','lori_rating'];
    for (const id of required) {
        if (!document.getElementById(id).value.trim()) {
            feedback.style.color = 'var(--lagos-red)';
            feedback.textContent = 'Please fill all required fields.';
            return;
        }
    }
    feedback.textContent = 'Submitting...';
    feedback.style.color = 'var(--lagos-blue)';
    const data = {
        assessorName: document.getElementById('lori_assessorName').value.trim(),
        teacherName: document.getElementById('lori_teacherName').value.trim(),
        school: document.getElementById('lori_school').value.trim(),
        class: document.getElementById('lori_class').value.trim(),
        rating: document.getElementById('lori_rating').value,
        comments: document.getElementById('lori_comments').value.trim(),
        evidence: await processFiles(document.getElementById('lori_fileInput'), 3)
    };
    try {
        const res = await fetch('/api/lori', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (res.ok) {
            feedback.style.color = 'var(--lagos-green)';
            feedback.textContent = 'LORI survey submitted successfully!';
            form.reset();
            document.getElementById('lori_uploadedFiles').innerHTML = '';
        } else {
            const err = await res.json();
            feedback.style.color = 'var(--lagos-red)';
            feedback.textContent = err.message || 'Submission failed.';
        }
    } catch (e) {
        feedback.style.color = 'var(--lagos-red)';
        feedback.textContent = 'Network error. Please try again.';
    }
}

// --- VOICES ---
async function submitVoices(event) {
    event.preventDefault();
    const form = document.getElementById('voicesForm');
    const feedback = document.getElementById('voices_feedback');
    feedback.textContent = '';
    const required = ['voices_learnerName','voices_age','voices_school','voices_class','voices_opinion'];
    for (const id of required) {
        if (!document.getElementById(id).value.trim()) {
            feedback.style.color = 'var(--lagos-red)';
            feedback.textContent = 'Please fill all required fields.';
            return;
        }
    }
    feedback.textContent = 'Submitting...';
    feedback.style.color = 'var(--lagos-blue)';
    const data = {
        learnerName: document.getElementById('voices_learnerName').value.trim(),
        age: document.getElementById('voices_age').value.trim(),
        school: document.getElementById('voices_school').value.trim(),
        class: document.getElementById('voices_class').value.trim(),
        opinion: document.getElementById('voices_opinion').value.trim(),
        evidence: await processFiles(document.getElementById('voices_fileInput'), 2)
    };
    try {
        const res = await fetch('/api/voices', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (res.ok) {
            feedback.style.color = 'var(--lagos-green)';
            feedback.textContent = 'VOICES survey submitted successfully!';
            form.reset();
            document.getElementById('voices_uploadedFiles').innerHTML = '';
        } else {
            const err = await res.json();
            feedback.style.color = 'var(--lagos-red)';
            feedback.textContent = err.message || 'Submission failed.';
        }
    } catch (e) {
        feedback.style.color = 'var(--lagos-red)';
        feedback.textContent = 'Network error. Please try again.';
    }
}
