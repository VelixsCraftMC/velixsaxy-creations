document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate-btn');
    const resultsContainer = document.getElementById('results-container');
    const versionSelect = document.getElementById('uuid-version');
    const countInput = document.getElementById('uuid-count');

    // Fungsi Generate UUID v4
    function generateV4() {
        return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    }

    // Fungsi Generate UUID v1
    function generateV1() {
        let d = new Date().getTime();
        return 'xxxxxxxx-xxxx-1xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            let r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }

    // Fungsi untuk membuat Box Code per UUID
    function createUUIDBox(uuidText, index) {
        const wrapper = document.createElement('div');
        wrapper.className = 'card code-card';
        wrapper.style.position = 'relative';
        wrapper.style.marginBottom = '12px';
        wrapper.style.animation = 'fadeIn 0.3s ease-out forwards';
        wrapper.style.opacity = '0';

        // Tombol Copy
        const copyBtn = document.createElement('button');
        copyBtn.className = 'btn-copy';
        copyBtn.textContent = 'Salin';
        
        // Label Index (Opsional)
        const label = document.createElement('span');
        label.style.position = 'absolute';
        label.style.left = '16px';
        label.style.top = '10px';
        label.style.fontSize = '10px';
        label.style.color = 'var(--text-sec)';
        label.textContent = `UUID #${index + 1}`;

        // Area Code
        const pre = document.createElement('pre');
        pre.style.height = 'auto';
        pre.style.padding = '40px 16px 20px 16px'; // Beri ruang untuk tombol & label
        pre.textContent = uuidText;

        // Logika Salin
        copyBtn.onclick = () => {
            navigator.clipboard.writeText(uuidText).then(() => {
                copyBtn.textContent = 'Tersalin!';
                copyBtn.classList.add('success');
                setTimeout(() => {
                    copyBtn.textContent = 'Salin';
                    copyBtn.classList.remove('success');
                }, 1500);
            });
        };

        wrapper.appendChild(label);
        wrapper.appendChild(copyBtn);
        wrapper.appendChild(pre);
        return wrapper;
    }

    // Event Klik Generate
    generateBtn.onclick = () => {
        const count = parseInt(countInput.value) || 1;
        const version = versionSelect.value;
        
        // Bersihkan hasil sebelumnya
        resultsContainer.innerHTML = '';

        for (let i = 0; i < count; i++) {
            let newUuid = (version === '4') ? generateV4() : generateV1();
            const uuidBox = createUUIDBox(newUuid, i);
            resultsContainer.appendChild(uuidBox);
        }

        // Feedback Getar/Animasi pada tombol
        generateBtn.style.transform = 'scale(0.97)';
        setTimeout(() => generateBtn.style.transform = 'scale(1)', 100);
    };
});