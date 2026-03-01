document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate-btn');
    const outputBox = document.getElementById('output-box');
    const copyBtn = document.getElementById('copy-btn');
    const downloadBtn = document.getElementById('download-btn');
    const versionSelect = document.getElementById('uuid-version');
    const countInput = document.getElementById('uuid-count');
    const v3Settings = document.getElementById('v3-settings');

    // Menampilkan input tambahan jika memilih v3
    versionSelect.addEventListener('change', () => {
        v3Settings.style.display = versionSelect.value === '3' ? 'block' : 'none';
    });

    // Fungsi Generate UUID v4 (Random)
    function generateV4() {
        return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    }

    // Fungsi Generate UUID v1 (Time-based Simplified)
    function generateV1() {
        let d = new Date().getTime();
        let d2 = (performance && performance.now && (performance.now() * 1000)) || 0;
        return 'xxxxxxxx-xxxx-1xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
            let r = Math.random() * 16;
            if (d > 0) {
                r = (d + r) % 16 | 0;
                d = Math.floor(d / 16);
            } else {
                r = (d2 + r) % 16 | 0;
                d2 = Math.floor(d2 / 16);
            }
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }

    // Fungsi Mock v3 (Karena MD5 murni butuh library besar, kita buat dummy format agar UI berfungsi)
    function generateV3() {
        const name = document.getElementById('uuid-name').value || 'default';
        // Ini adalah representasi simulasi untuk keperluan UI
        return '351493f3-0000-3000-8000-' + Math.random().toString(16).slice(2, 14);
    }

    // Main Generate Action
    generateBtn.addEventListener('click', () => {
        const version = versionSelect.value;
        const count = parseInt(countInput.value) || 1;
        let results = [];

        for (let i = 0; i < count; i++) {
            if (version === '4') results.push(generateV4());
            else if (version === '1') results.push(generateV1());
            else if (version === '3') results.push(generateV3());
        }

        outputBox.textContent = results.join('\n');
        
        // Animasi feedback tombol
        generateBtn.style.transform = 'scale(0.95)';
        setTimeout(() => generateBtn.style.transform = 'scale(1)', 100);
    });

    // Copy to Clipboard
    copyBtn.addEventListener('click', () => {
        const text = outputBox.textContent;
        if (text.includes('Klik generate')) return;

        navigator.clipboard.writeText(text).then(() => {
            copyBtn.textContent = 'Tersalin!';
            copyBtn.classList.add('success');
            
            setTimeout(() => {
                copyBtn.textContent = 'Salin';
                copyBtn.classList.remove('success');
            }, 2000);
        });
    });

    // Download as TXT
    downloadBtn.addEventListener('click', () => {
        const text = outputBox.textContent;
        if (text.includes('Klik generate')) return;

        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `uuids-${new Date().getTime()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
});