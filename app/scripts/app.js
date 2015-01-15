(function (AudioContext, Sequencer) {
    'use strict';

    if (typeof AudioContext === 'undefined' ||typeof Sequencer === 'undefined') {
        return;
    }

    let sequencerContainer = document.getElementsByClassName('sequencer')[0];
    let errorMessage = document.getElementsByClassName('error-message')[0];
    sequencerContainer.removeChild(errorMessage);

    let sounds = [
        {
            name: 'ClHat',
            file: './sounds/drumkit/CYCdh_ElecK01-ClHat01.wav'
        },
        {
            name: 'OpHat',
            file: './sounds/drumkit/CYCdh_ElecK01-OpHat01.wav'
        },
        {
            name: 'Cymbal',
            file: './sounds/drumkit/CYCdh_ElecK01-Cymbal.wav'
        },
        {
            name: 'Kick',
            file: './sounds/drumkit/CYCdh_ElecK01-Kick01.wav'
        },
        {
            name: 'Snare',
            file: './sounds/drumkit/CYCdh_ElecK01-Snr01.wav'
        },
        {
            name: 'Tom01',
            file: './sounds/drumkit/CYCdh_ElecK01-Tom01.wav'
        },
        {
            name: 'Tom02',
            file: './sounds/drumkit/CYCdh_ElecK01-Tom02.wav'
        },
        {
            name: 'Tom03',
            file: './sounds/drumkit/CYCdh_ElecK01-Tom03.wav'
        },
        {
            name: 'Tom04',
            file: './sounds/drumkit/CYCdh_ElecK01-Tom04.wav'
        }
    ];
    let bars = 4;
    let bpm = 75;

    let sequencer = new Sequencer(sounds, bars, bpm, sequencerContainer);
})(window.AudioContext, window.Sequencer);
