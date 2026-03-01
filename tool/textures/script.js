let store = { flip: [], item: [], terrain: [] };

// Helper: Minecraft Safe Strings
function clean(str) {
    return str.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_/]/g, '').trim();
}

// Menu Navigation
function switchMenu(tab, el) {
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.ios-tab').forEach(t => t.classList.remove('active'));
    
    document.getElementById(`tab-${tab}`).classList.add('active');
    el.classList.add('active');
    
    const titles = { flip: 'Flipbook Textures', item: 'Item Texture', terrain: 'Terrain Texture' };
    document.getElementById('nav-title').textContent = titles[tab];
    updatePreview();
}

// Bulk Upload
function bulkUpload(input, type) {
    const files = Array.from(input.files);
    const pathPrefix = type === 'item' ? 'textures/items/' : 'textures/blocks/';
    
    files.forEach(file => {
        const name = clean(file.name.split('.').slice(0, -1).join('.'));
        if (type === 'flip') {
            store.flip.push({ id: Math.random(), path: pathPrefix + name, tile: name, ticks: 3, blend: false });
        } else {
            store[type].push({ id: Math.random(), key: name, path: pathPrefix + name });
        }
    });
    input.value = "";
    renderList();
    updatePreview();
}

// Manual Add
function addManual(type) {
    if (type === 'flip') {
        store.flip.push({ id: Math.random(), path: "textures/", tile: "new_tile", ticks: 3, blend: false });
    } else {
        store[type].push({ id: Math.random(), key: "new_key", path: "textures/" });
    }
    renderList();
    updatePreview();
}

// Import JSON
function importJSON(input, type) {
    const file = input.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const json = JSON.parse(e.target.result);
            if (type === 'flip' && Array.isArray(json)) {
                store.flip = json.map(f => ({
                    id: Math.random(), path: f.flipbook_texture, tile: f.atlas_tile, ticks: f.ticks_per_frame, blend: f.blend_frames
                }));
            } else if (json.texture_data) {
                // Set global metadata if available
                if (type === 'item') {
                    document.getElementById('itemRP').value = json.resource_pack_name || "vanilla";
                    document.getElementById('itemAtlas').value = json.texture_name || "atlas.items";
                } else {
                    document.getElementById('terrainRP').value = json.resource_pack_name || "vanilla";
                    document.getElementById('terrainPad').value = json.padding || 8;
                }
                
                const entries = [];
                for (let key in json.texture_data) {
                    const tex = json.texture_data[key].textures;
                    entries.push({ id: Math.random(), key: key, path: Array.isArray(tex) ? tex[0] : tex });
                }
                store[type] = entries;
            }
            renderList();
            updatePreview();
            alert("Import Success!");
        } catch (err) {
            alert("Invalid JSON Format");
        }
    };
    reader.readAsText(file);
    input.value = "";
}

function removeItem(type, id) {
    store[type] = store[type].filter(x => x.id !== id);
    renderList();
    updatePreview();
}

function updateVal(type, id, key, val) {
    const entry = store[type].find(x => x.id === id);
    if (!entry) return;
    if (key === 'blend') entry[key] = val;
    else if (key === 'ticks') entry[key] = parseInt(val) || 0;
    else entry[key] = clean(val);
    updatePreview();
}

function renderList() {
    ['flip', 'item', 'terrain'].forEach(type => {
        const container = document.getElementById(`list-${type}`);
        container.innerHTML = "";
        store[type].forEach(item => {
            const div = document.createElement('div');
            div.className = 'card';
            if (type === 'flip') {
                div.innerHTML = `
                    <div class="form-row"><label>Path</label><input type="text" value="${item.path}" oninput="updateVal('flip', ${item.id}, 'path', this.value)"></div>
                    <div class="form-row"><label>Tile</label><input type="text" value="${item.tile}" oninput="updateVal('flip', ${item.id}, 'tile', this.value)"></div>
                    <div class="form-row"><label>Ticks</label><input type="number" value="${item.ticks}" oninput="updateVal('flip', ${item.id}, 'ticks', this.value)"></div>
                    <div class="form-row"><label>Blend</label><input type="checkbox" ${item.blend?'checked':''} onchange="updateVal('flip', ${item.id}, 'blend', this.checked)"></div>
                    <button class="btn-remove" onclick="removeItem('flip', ${item.id})">Remove</button>
                `;
            } else {
                div.innerHTML = `
                    <div class="form-row"><label>Key</label><input type="text" value="${item.key}" oninput="updateVal('${type}', ${item.id}, 'key', this.value)"></div>
                    <div class="form-row"><label>Path</label><input type="text" value="${item.path}" oninput="updateVal('${type}', ${item.id}, 'path', this.value)"></div>
                    <button class="btn-remove" onclick="removeItem('${type}', ${item.id})">Remove</button>
                `;
            }
            container.appendChild(div);
        });
    });
}

function updatePreview() {
    // Flipbook
    const flip = store.flip.map(f => ({ flipbook_texture: f.path, atlas_tile: f.tile, ticks_per_frame: f.ticks, blend_frames: f.blend }));
    document.getElementById('codeFlip').textContent = JSON.stringify(flip, null, 4);

    // Item
    const item = { resource_pack_name: clean(document.getElementById('itemRP').value), texture_name: clean(document.getElementById('itemAtlas').value), texture_data: {} };
    store.item.forEach(i => { item.texture_data[i.key] = { textures: i.path }; });
    document.getElementById('codeItem').textContent = JSON.stringify(item, null, 4);

    // Terrain
    const terrain = { resource_pack_name: clean(document.getElementById('terrainRP').value), texture_name: "atlas.terrain", padding: parseInt(document.getElementById('terrainPad').value), num_mip_levels: 4, texture_data: {} };
    store.terrain.forEach(t => { terrain.texture_data[t.key] = { textures: t.path }; });
    document.getElementById('codeTerrain').textContent = JSON.stringify(terrain, null, 4);
}

function copyCode(id) {
    navigator.clipboard.writeText(document.getElementById(id).textContent).then(() => alert("Copied!"));
}

function exportJSON(type) {
    const ids = { flip: 'codeFlip', item: 'codeItem', terrain: 'codeTerrain' };
    const files = { flip: 'flipbook_textures.json', item: 'item_texture.json', terrain: 'terrain_texture.json' };
    const blob = new Blob([document.getElementById(ids[type]).textContent], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = files[type];
    a.click();
}

updatePreview();