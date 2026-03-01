// UUID Storage (Persist selama sesi)
const UUIDS = {
    bp_h: crypto.randomUUID(),
    bp_m: crypto.randomUUID(),
    bp_s: crypto.randomUUID(),
    rp_h: crypto.randomUUID(),
    rp_m: crypto.randomUUID()
};

let subpacks = { bp: [], rp: [] };

// Tab Navigation
function switchTab(e, tabId) {
    e.preventDefault();
    document.querySelectorAll('.tab-page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.ios-tab').forEach(t => t.classList.remove('active'));
    document.getElementById(`tab-${tabId}-content`).classList.add('active');
    e.currentTarget.classList.add('active');
    if(tabId === 'preview') updateLive();
}

// UI Toggles
function toggleSections() {
    const isBP = document.getElementById('enableBP').checked;
    const isRP = document.getElementById('enableRP').checked;
    const isScript = document.getElementById('bpScript').checked;

    document.getElementById('bp-editor').style.display = isBP ? 'block' : 'none';
    document.getElementById('rp-editor').style.display = isRP ? 'block' : 'none';
    document.getElementById('script-options').style.display = isScript ? 'block' : 'none';
    
    // Checkbox link hanya aktif jika kedua pack aktif
    document.getElementById('link-row').style.opacity = (isBP && isRP) ? "1" : "0.5";
    document.getElementById('linkPacks').disabled = !(isBP && isRP);
    if (!(isBP && isRP)) document.getElementById('linkPacks').checked = false;

    updateLive();
}

// Subpack Logic
function addSubpack(type) {
    const id = Date.now();
    subpacks[type].push({ 
        id, 
        folder: `subpack_${subpacks[type].length + 1}`, 
        name: `Subpack ${subpacks[type].length + 1}`, 
        tier: 0 
    });
    renderSubpacks();
    updateLive();
}

function removeSubpack(type, id) {
    subpacks[type] = subpacks[type].filter(s => s.id !== id);
    renderSubpacks();
    updateLive();
}

function updateSubpackValue(type, id, key, val) {
    const s = subpacks[type].find(x => x.id === id);
    if(s) s[key] = key === 'tier' ? (parseInt(val) || 0) : val;
    updateLive();
}

function renderSubpacks() {
    ['bp', 'rp'].forEach(type => {
        const container = document.getElementById(`${type}-subpacks-container`);
        container.innerHTML = '';
        subpacks[type].forEach(s => {
            const div = document.createElement('div');
            div.className = 'card';
            div.innerHTML = `
                <div class="form-row"><label>Folder</label><input type="text" value="${s.folder}" oninput="updateSubpackValue('${type}', ${s.id}, 'folder', this.value)"></div>
                <div class="form-row"><label>Name</label><input type="text" value="${s.name}" oninput="updateSubpackValue('${type}', ${s.id}, 'name', this.value)"></div>
                <div class="form-row"><label>Tier</label><input type="text" value="${s.tier}" oninput="updateSubpackValue('${type}', ${s.id}, 'tier', this.value)"></div>
                <button class="btn-remove" onclick="removeSubpack('${type}', ${s.id})">Remove Subpack</button>
            `;
            container.appendChild(div);
        });
    });
}

function getVer(id) {
    return (document.getElementById(id).value || "1.0.0").split('.').map(n => parseInt(n) || 0);
}

// CORE GENERATOR
function getManifestData() {
    const isBP = document.getElementById('enableBP').checked;
    const isRP = document.getElementById('enableRP').checked;
    const linkPacks = document.getElementById('linkPacks').checked && isBP && isRP;
    
    let bp = null, rp = null;

    if (isBP) {
        bp = {
            format_version: 2,
            header: {
                name: document.getElementById('bpName').value,
                description: document.getElementById('bpDesc').value,
                uuid: UUIDS.bp_h,
                version: getVer('bpVer'),
                min_engine_version: getVer('bpEngine')
            },
            modules: [{ type: "data", uuid: UUIDS.bp_m, version: getVer('bpVer') }],
            metadata: { authors: [ "Generator" ] }
        };

        if (document.getElementById('bpScript').checked) {
            bp.modules.push({
                type: "script",
                language: "javascript",
                entry: document.getElementById('bpScriptPath').value,
                uuid: UUIDS.bp_s,
                version: getVer('bpVer')
            });
            
            bp.dependencies = bp.dependencies || [];
            if(document.getElementById('modServer').checked) bp.dependencies.push({ module_name: "@minecraft/server", version: document.getElementById('verServer').value });
            if(document.getElementById('modUI').checked) bp.dependencies.push({ module_name: "@minecraft/server-ui", version: document.getElementById('verUI').value });
            if(document.getElementById('modCommon').checked) bp.dependencies.push({ module_name: "@minecraft/server-common", version: document.getElementById('verCommon').value });
        }

        // Add Dependency to RP
        if (linkPacks) {
            bp.dependencies = bp.dependencies || [];
            bp.dependencies.push({
                uuid: UUIDS.rp_h,
                version: getVer('rpVer')
            });
        }

        if (subpacks.bp.length > 0) {
            bp.subpacks = subpacks.bp.map(s => ({ folder_name: s.folder, name: s.name, memory_tier: s.tier }));
        }
    }

    if (isRP) {
        rp = {
            format_version: 2,
            header: {
                name: document.getElementById('rpName').value,
                description: document.getElementById('rpDesc').value,
                uuid: UUIDS.rp_h,
                version: getVer('rpVer'),
                min_engine_version: getVer('rpEngine')
            },
            modules: [{ type: "resources", uuid: UUIDS.rp_m, version: getVer('rpVer') }]
        };

        // Add Dependency to BP
        if (linkPacks) {
            rp.dependencies = rp.dependencies || [];
            rp.dependencies.push({
                uuid: UUIDS.bp_h,
                version: getVer('bpVer')
            });
        }

        if (subpacks.rp.length > 0) {
            rp.subpacks = subpacks.rp.map(s => ({ folder_name: s.folder, name: s.name, memory_tier: s.tier }));
        }
    }

    return { bp, rp };
}

function updateLive() {
    const { bp, rp } = getManifestData();
    document.getElementById('bpCode').textContent = bp ? JSON.stringify(bp, null, 4) : "// Behavior Pack Disabled";
    document.getElementById('rpCode').textContent = rp ? JSON.stringify(rp, null, 4) : "// Resource Pack Disabled";
}

function copyCode(id) {
    const code = document.getElementById(id).textContent;
    navigator.clipboard.writeText(code).then(() => alert("Manifest Copied!"));
}

async function downloadPack(type) {
    const data = getManifestData();
    const targetJson = type === 'bp' ? data.bp : data.rp;
    
    if (!targetJson) return;

    const zip = new JSZip();
    zip.file("manifest.json", JSON.stringify(targetJson, null, 4));

    const iconInput = document.getElementById('packIcon');
    if (iconInput.files.length > 0) {
        const iconData = await iconInput.files[0].arrayBuffer();
        zip.file("pack_icon.png", iconData);
    }

    zip.generateAsync({ type: "blob" }).then(content => {
        const url = URL.createObjectURL(content);
        const a = document.createElement("a");
        a.href = url;
        a.download = (type === 'bp' ? "Behavior_" : "Resource_") + "Pack.mcpack";
        a.click();
        URL.revokeObjectURL(url);
    });
}

// Initialize
toggleSections();