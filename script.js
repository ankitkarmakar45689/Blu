document.addEventListener('DOMContentLoaded', () => {
    // --- State & Constants ---
    const state = {
        pdf: null,
        fullText: '',
        words: [],
        currentWordIndex: -1,
        isReading: false,
        synth: window.speechSynthesis,
        utterance: null,
        voices: [],
        settings: {
            darkMode: false,
            blueLight: false,
            warmMode: false,
            fontSize: 18,
            lineSpacing: 1.6,
            speed: 1,
            selectedVoice: null
        }
    };

    // Set PDF.js worker
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

    // --- DOM Elements ---
    const elements = {
        fileUpload: document.getElementById('fileUpload'),
        fileName: document.getElementById('fileName'),
        playBtn: document.getElementById('playBtn'),
        pauseBtn: document.getElementById('pauseBtn'),
        stopBtn: document.getElementById('stopBtn'),
        readerPanel: document.getElementById('readerPanel'),
        welcomeScreen: document.getElementById('welcomeScreen'),
        textContent: document.getElementById('textContent'),
        voiceSelect: document.getElementById('voiceSelect'),
        speedBtns: document.querySelectorAll('.speed-btn'),
        fontSizeSlider: document.getElementById('fontSize'),
        lineSpacingSlider: document.getElementById('lineSpacing'),
        darkModeToggle: document.getElementById('darkMode'),
        blueLightToggle: document.getElementById('blueLight'),
        warmModeToggle: document.getElementById('warmMode'),
        progressBar: document.getElementById('progressBar'),
        readingProgress: document.getElementById('readingProgress'),
        pageInfo: document.getElementById('pageInfo'),
        blueLightOverlay: document.getElementById('blueLightOverlay'),
        warmModeOverlay: document.getElementById('warmModeOverlay')
    };

    // --- Initialization ---
    function init() {
        loadVoices();
        if (state.synth.onvoiceschanged !== undefined) {
            state.synth.onvoiceschanged = loadVoices;
        }
        setupEventListeners();
    }

    function loadVoices() {
        state.voices = state.synth.getVoices();
        elements.voiceSelect.innerHTML = state.voices
            .map((voice, index) => `<option value="${index}">${voice.name} (${voice.lang})</option>`)
            .join('');

        // Try to pick a default high quality voice
        const defaultVoice = state.voices.find(v => v.name.includes('Google') || v.name.includes('Natural'));
        if (defaultVoice) {
            elements.voiceSelect.value = state.voices.indexOf(defaultVoice);
        }
    }

    // --- Event Listeners ---
    function setupEventListeners() {
        elements.fileUpload.addEventListener('change', handleFileUpload);

        elements.playBtn.addEventListener('click', startReading);
        elements.pauseBtn.addEventListener('click', pauseReading);
        elements.stopBtn.addEventListener('click', stopReading);

        elements.darkModeToggle.addEventListener('change', (e) => {
            document.body.classList.toggle('dark-mode', e.target.checked);
        });

        elements.blueLightToggle.addEventListener('change', (e) => {
            elements.blueLightOverlay.classList.toggle('filter-active', e.target.checked);
        });

        elements.warmModeToggle.addEventListener('change', (e) => {
            elements.warmModeOverlay.classList.toggle('filter-active', e.target.checked);
        });

        elements.fontSizeSlider.addEventListener('input', (e) => {
            elements.textContent.style.setProperty('--font-size', `${e.target.value}px`);
        });

        elements.lineSpacingSlider.addEventListener('input', (e) => {
            elements.textContent.style.setProperty('--line-spacing', e.target.value);
        });

        elements.speedBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                elements.speedBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                state.settings.speed = parseFloat(btn.dataset.speed);
                if (state.isReading) {
                    // Update speed on the fly if reading
                    stopReading();
                    startReading();
                }
            });
        });
    }

    // --- PDF Handling ---
    async function handleFileUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        elements.fileName.textContent = file.name;

        const reader = new FileReader();
        reader.onload = async function () {
            const typedarray = new Uint8Array(this.result);
            await extractText(typedarray);
        };
        reader.readAsArrayBuffer(file);
    }

    async function extractText(data) {
        try {
            const loadingTask = pdfjsLib.getDocument(data);
            state.pdf = await loadingTask.promise;

            elements.pageInfo.textContent = `Page: 1/${state.pdf.numPages}`;

            let fullText = '';
            for (let i = 1; i <= state.pdf.numPages; i++) {
                const page = await state.pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map(item => item.str).join(' ');
                fullText += pageText + ' ';
            }

            state.fullText = fullText.trim();
            renderText(state.fullText);

            elements.welcomeScreen.classList.add('hidden');
            elements.textContent.classList.remove('hidden');
            elements.playBtn.disabled = false;
        } catch (error) {
            console.error('Error handling PDF:', error);
            alert('Failed to load PDF. Please try another file.');
        }
    }

    function renderText(text) {
        const wordArr = text.split(/\s+/);
        state.words = wordArr;

        elements.textContent.innerHTML = wordArr
            .map((word, i) => `<span class="word" id="word-${i}">${word}</span>`)
            .join(' ');
    }

    // --- Speech Synthesis ---
    function startReading() {
        if (state.synth.paused) {
            state.synth.resume();
            state.isReading = true;
            updateControls(true);
            return;
        }

        if (state.currentWordIndex === -1) state.currentWordIndex = 0;

        // Speak from the current word index
        const textToSpeak = state.words.slice(state.currentWordIndex).join(' ');
        state.utterance = new SpeechSynthesisUtterance(textToSpeak);

        const voiceIdx = elements.voiceSelect.value;
        state.utterance.voice = state.voices[voiceIdx];
        state.utterance.rate = state.settings.speed;

        state.utterance.onboundary = (event) => {
            if (event.name === 'word') {
                const charIndex = event.charIndex;
                findAndHighlightWord(charIndex);
            }
        };

        state.utterance.onend = () => {
            if (state.isReading) {
                stopReading();
            }
        };

        state.synth.speak(state.utterance);
        state.isReading = true;
        updateControls(true);
    }

    function findAndHighlightWord(charIndex) {
        // charIndex is relative to the textToSpeak
        const wordsInSubstring = state.words.slice(state.currentWordIndex);
        let cumulative = 0;
        let localWordIdx = 0;

        for (let i = 0; i < wordsInSubstring.length; i++) {
            if (cumulative + wordsInSubstring[i].length >= charIndex) {
                localWordIdx = i;
                break;
            }
            cumulative += wordsInSubstring[i].length + 1; // +1 for space
        }

        const absoluteIndex = state.currentWordIndex + localWordIdx;

        // Remove previous highlight
        const oldHighlight = document.querySelector('.word.highlight');
        if (oldHighlight) oldHighlight.classList.remove('highlight');

        const wordEl = document.getElementById(`word-${absoluteIndex}`);
        if (wordEl) {
            wordEl.classList.add('highlight');
            wordEl.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // Update progress
            const progress = ((absoluteIndex + 1) / state.words.length) * 100;
            elements.progressBar.style.width = `${progress}%`;
            elements.readingProgress.textContent = `${Math.round(progress)}% read`;
        }
    }

    function pauseReading() {
        state.synth.pause();
        state.isReading = false;
        updateControls(false);
    }

    function stopReading() {
        state.synth.cancel();
        state.isReading = false;
        state.currentWordIndex = -1;

        // Remove all highlights
        document.querySelectorAll('.word.highlight').forEach(el => el.classList.remove('highlight'));

        updateControls(false);
        elements.progressBar.style.width = '0%';
        elements.readingProgress.textContent = '0% read';
    }

    function updateControls(isPlaying) {
        elements.playBtn.disabled = isPlaying;
        elements.pauseBtn.disabled = !isPlaying;
        elements.stopBtn.disabled = false;
    }

    init();
});
