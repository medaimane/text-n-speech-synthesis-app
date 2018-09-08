// Init SpeechSynth API
const synth = window.speechSynthesis;

// DOM Query
const form = document.querySelector('form');
const textarea = document.querySelector('textarea');
const voiceSelect = document.querySelector('#voice-select')
const rate = document.querySelector('#rate');
const ratevalue = document.querySelector('#rate-value');
const pitch = document.querySelector('#pitch');
const pitchvalue = document.querySelector('#pitch-value');

// Init the voices array

let voices = [];

const getVoices = () => {
    voices = synth.getVoices();

    // Loop through voices and create an option for each one
    voices.forEach(voice => {
        // create option element
        const option = document.createElement('option');
        
        // Fill option with name and language
        option.textContent = voice.name + '('+voice.lang+')';

        // Set needed option attributes
        option.setAttribute('data-lang', voice.lang);
        option.setAttribute('data-name', voice.name);

        voiceSelect.appendChild(option);
    });
}

getVoices();

if(synth.onvoiceschanged !== undefined) {
    synth.onvoiceschanged = getVoices;
}

// Speak
const speak = () => {
    // Check if speaking
    if(synth.speaking) {
        console.error('Already speaking ...');
        return;
    }

    if(textarea.value !== '') {
        // Get Speak text
        const speakText = new SpeechSynthesisUtterance(textarea.value);

        // Speak end
        speakText.onend = e => {
            console.log('Done speaking ...');
        }

        // Speak error
        speakText.onerror = e => {
            console.error('Something went wrong');
        }

        // Selected voice
        const selectedVoice = voiceSelect.selectedOptions[0]
            .getAttribute('data-name');

        // Loop through voices
        voices.forEach(voice => {
            if(voice.name === selectedVoice){
                speakText.voice = voice;
            }
        });

        // Set pitch and rate
        speakText.rate = rate.value;
        speakText.pitch = pitch.value;

        // Speak
        synth.speak(speakText);
    }
};


// EVENT Listeners

// Text form submit
form.addEventListener('submit', e => {
    e.preventDefault();

    speak();
    textarea.blur();
});

// Rate and Pitch value change
rate.addEventListener('change', e => ratevalue.textContent = rate.value);
pitch.addEventListener('change', e => pitchvalue.textContent = pitch.value);

// Voice select change
voiceSelect.addEventListener('change', e => speak());