// Konfigurasi Format Version
const versions = ["1.14.0", "1.15.0", "1.16.0", "1.17.0", "1.20.0"];
let appState = {
    formatVersion: "1.14.0",
    sounds: []
};

window.onload = () => {
    const sel = document.getElementById('format-version-select');
    versions.forEach(v => {
        const opt = document.createElement('option');
        opt.value = v; opt.textContent = v;
        sel.appendChild(opt);
    });
    sel.onchange = (e) => { appState.formatVersion = e.target.value; updatePreviews(); };

    // Tambah satu entri default
    addSoundEntry();
};

// --- LOGIC UTAMA ---

function cleanPath(path) {
    // Menghilangkan double slash // dan slash di awal/akhir
    return path.replace(/\/+/g, '/').replace(/^\/|\/$/g, '');
}

function handleIdInput(e, index) {
    // Spasi otomatis jadi titik
    let val = e.target.value.replace(/\s+/g, '.');
    e.target.value = val;
    appState.sounds[index].id = val;
    updatePreviews();
}

function addSoundEntry() {
    appState.sounds.push({
        id: "custom.sound",
        legacy: true,
        category: "player",
        pathList: [{ path: "sounds/example", file: null }]
    });
    renderUI();
    updatePreviews();
}

function removeSoundEntry(idx) {
    appState.sounds.splice(idx, 1);
    renderUI();
    updatePreviews();
}

function addPathManual(idx) {
    appState.sounds[idx].pathList.push({ path: "sounds/", file: null });
    renderUI();
}

function removePath(sIdx, pIdx) {
    appState.sounds[sIdx].pathList.splice(pIdx, 1);
    renderUI();
    updatePreviews();
}

function handleFileUpload(e, soundIndex) {
    const file = e.target.files[0];
    if (!file) return;

    const fileNameNoExt = file.name.replace(/\.[^/.]+$/, "");
    const folderFromId = appState.sounds[soundIndex].id.replace(/\./g, '/');
    
    // Perbaikan path: sounds/folder/stunning (tanpa double //)
    const finalPath = cleanPath(`sounds/${folderFromId}/${fileNameNoExt}`);

    appState.sounds[soundIndex].pathList.push({
        path: finalPath,
        file: file
    });

    renderUI();
    updatePreviews();
}

// --- UI RENDERER ---

function renderUI() {
    const container = document.getElementById('sound-entries-container');
    container.innerHTML = '';

    appState.sounds.forEach((sound, idx) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px">
                <label style="color:var(--accent); margin:0">Sound Entry #${idx+1}</label>
                <button class="btn-danger-small btn" onclick="removeSoundEntry(${idx})">Delete</button>
            </div>
            
            <label>Sound ID (Auto-dot)</label>
            <input type="text" value="${sound.id}" oninput="handleIdInput(event, ${idx})" placeholder="contoh: monster.rawr">

            <div class="form-grid" style="margin-top:15px">
                <div>
                    <label>Category</label>
                    <input type="text" value="${sound.category}" oninput="appState.sounds[${idx}].category=this.value; updatePreviews()">
                </div>
                <div style="display:flex; align-items:center; gap:10px; padding-top:20px">
                    <input type="checkbox" style="width:20px; height:20px" ${sound.legacy ? 'checked' : ''} 
                        onchange="appState.sounds[${idx}].legacy=this.checked; updatePreviews()">
                    <span style="font-size:14px">Legacy Dist.</span>
                </div>
            </div>

            <div class="param-box">
                <label>Paths / Folders</label>
                <div id="paths-list-${idx}">
                    ${sound.pathList.map((p, pIdx) => `
                        <div class="flex-row" style="margin-bottom:8px">
                            <input type="text" value="${p.path}" oninput="appState.sounds[${idx}].pathList[${pIdx}].path=this.value; updatePreviews()">
                            <button class="btn btn-danger-small" onclick="removePath(${idx}, ${pIdx})">X</button>
                        </div>
                    `).join('')}
                </div>
                <div class="flex-row" style="margin-top:10px">
                    <button class="btn btn-warning" onclick="addPathManual(${idx})">+ Path</button>
                    <button class="btn btn-warning" onclick="document.getElementById('f-${idx}').click()">+ File OGG</button>
                    <input type="file" id="f-${idx}" accept=".ogg" style="display:none" onchange="handleFileUpload(event, ${idx})">
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// --- NAVIGATION & PREVIEW ---

function navigate(viewId, title, el) {
    // Navigasi Tabs
    document.querySelectorAll('.ios-tab').forEach(t => t.classList.remove('active'));
    el.classList.add('active');

    // Ganti View
    document.querySelectorAll('.page-view').forEach(v => v.classList.remove('active'));
    document.getElementById('view-' + viewId).classList.add('active');

    // Ganti Judul Top Bar
    document.getElementById('nav-title').textContent = title;

    updatePreviews();
}

function updatePreviews() {
    const definitions = {};
    appState.sounds.forEach(s => {
        if (!s.id) return;
        definitions[s.id] = {
            "__use_legacy_max_distance": s.legacy ? "true" : "false",
            "category": s.category,
            "sounds": s.pathList.map(p => cleanPath(p.path))
        };
    });

    const jsonResult = { "format_version": appState.formatVersion, "sound_definitions": definitions };
    
    // JSON Preview
    document.getElementById('json-preview').textContent = JSON.stringify(jsonResult, null, 4);

    // Folder Preview
    const folderBox = document.getElementById('folder-preview-content');
    let tree = `<div style="color:var(--accent)">📦 sound_definitions_pack.zip</div>`;
    tree += `<div style="margin-left:20px; color:var(--success)">📂 sounds</div>`;
    tree += `<div style="margin-left:40px; color:var(--text)">📄 sound_definitions.json</div>`;
    
    appState.sounds.forEach(s => {
        s.pathList.forEach(p => {
            const pClean = cleanPath(p.path);
            if(pClean) tree += `<div style="margin-left:40px; color:var(--text-sec)">🎵 ${pClean}.ogg</div>`;
        });
    });
    folderBox.innerHTML = tree;
}

// --- IMPORT & DOWNLOAD ---

function copyCode() {
    const code = document.getElementById('json-preview').textContent;
    navigator.clipboard.writeText(code);
    const btn = document.getElementById('btn-copy');
    btn.textContent = "Copied!";
    btn.classList.add('success');
    setTimeout(() => { btn.textContent = "Copy"; btn.classList.remove('success'); }, 2000);
}

function importJson(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
        try {
            const json = JSON.parse(ev.target.result);
            loadData(json);
        } catch(e) { alert("Invalid JSON!"); }
    };
    reader.readAsText(file);
}

async function importZip(e) {
    const file = e.target.files[0];
    if (!file) return;
    const zip = await JSZip.loadAsync(file);
    const jsonFile = zip.file(/sound_definitions\.json$/i)[0];
    if (jsonFile) {
        const content = await jsonFile.async("string");
        loadData(JSON.parse(content));
    } else {
        alert("sound_definitions.json tidak ditemukan di dalam ZIP!");
    }
}

function loadData(json) {
    appState.formatVersion = json.format_version || "1.14.0";
    appState.sounds = [];
    for (const [id, data] of Object.entries(json.sound_definitions)) {
        appState.sounds.push({
            id: id,
            legacy: data.__use_legacy_max_distance === "true",
            category: data.category,
            pathList: data.sounds.map(p => ({ path: p, file: null }))
        });
    }
    renderUI();
    updatePreviews();
}

async function downloadZip() {
    const zip = new JSZip();
    const definitions = {};

    appState.sounds.forEach(s => {
        if (!s.id) return;
        definitions[s.id] = {
            "__use_legacy_max_distance": s.legacy ? "true" : "false",
            "category": s.category,
            "sounds": s.pathList.map(p => {
                const pathClean = cleanPath(p.path);
                if (p.file) {
                    zip.file(`${pathClean}.ogg`, p.file);
                }
                return pathClean;
            })
        };
    });

    const jsonBlob = JSON.stringify({ "format_version": appState.formatVersion, "sound_definitions": definitions }, null, 4);
    zip.file("sounds/sound_definitions.json", jsonBlob);

    const content = await zip.generateAsync({type:"blob"});
    saveAs(content, "sound_definitions_generated.zip");
}