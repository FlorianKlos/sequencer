window.Sequencer = (function (AudioContext, BufferLoader) {
    'use strict';

    class SequencerMenu {
        constructor(bpmValue, changeBpmFunction, addBarFunction, removeBarFunction, clearFunction) {
            this.showBpm = document.createElement('div');
            this.showBpm.classList.add('bpm');
            this.showBpm.appendChild(document.createTextNode(bpmValue.toString()));

            this.changeBpm = document.createElement('input');
            this.changeBpm.classList.add('slider');
            this.changeBpm.setAttribute('type', 'range');
            this.changeBpm.setAttribute('min', '20');
            this.changeBpm.setAttribute('max', '180');
            this.changeBpm.setAttribute('step', '5');
            this.changeBpm.setAttribute('value', bpmValue.toString());
            this.changeBpm.addEventListener('input', event => {
                let bpm = event.target.value;
                changeBpmFunction(parseInt(bpm));
                this.showBpm.innerHTML = bpm;
                this.changeBpm.value = bpm;
            });

            this.addBar = document.createElement('button');
            this.addBar.appendChild(document.createTextNode('+'));
            this.addBar.addEventListener('click', () => addBarFunction());

            this.removeBar = document.createElement('button');
            this.removeBar.appendChild(document.createTextNode('-'));
            this.removeBar.addEventListener('click', () => removeBarFunction());

            this.clearSequencer = document.createElement('button');
            this.clearSequencer.appendChild(document.createTextNode('Clear'));
            this.clearSequencer.addEventListener('click', () => clearFunction());
        }

        getRenderedMenu() {
            let menu = document.createElement('div');
            menu.className = 'menu';
            menu.appendChild(this.showBpm);
            menu.appendChild(this.changeBpm);
            menu.appendChild(this.addBar);
            menu.appendChild(this.removeBar);
            menu.appendChild(this.clearSequencer);
            return menu;
        }
    }

    class SequencerNote {
        constructor() {
            this.active = false;

            this.tile = document.createElement('div');
            this.tile.classList.add('note');
            this.tile.addEventListener('click', () => this.toggleActiveState());
        }

        toggleActiveState() {
            this.active = !this.active;
            this.tile.classList.toggle('active');
        }

        currentlyPlaying(playing = true) {
            if (playing === true) {
                this.tile.classList.add('playing');
                return;
            }
            this.tile.classList.remove('playing');
        }

        reset() {
            this.active = false;
            this.tile.classList.remove('active');
        }

        getRenderedNote() {
            return this.tile;
        }
    }

    class SequencerInstrument {
        constructor(name, sound, context, notes) {
            this.name = name;
            this.sound = sound;
            this.context = context;

            this.notes = [];
            for (let i = 0; i < notes; i++) {
                this.notes.push(new SequencerNote());
            }

            this.instrument = document.createElement('div');
            this.instrument.classList.add('instrument');
        }

        playSound() {
            let source = this.context.createBufferSource();
            source.buffer = this.sound;
            source.connect(this.context.destination);
            source.start(0);
        }

        resetNotes() {
            this.notes.map(note => note.reset());
        }

        playNote(index) {
            this.notes.map(note => note.currentlyPlaying(false));
            let note = this.notes[index];
            note.currentlyPlaying();
            if (note.active === true) {
                this.playSound();
            }
        }

        addNotes(amount) {
            for (let i = 0; i < amount; i++) {
                let note = new SequencerNote();
                this.notes.push(note);
                this.instrument.appendChild(note.getRenderedNote());
            }
        }

        removeNotes(amount) {
            for (let i = 0; i < amount; i++) {
                let note = this.notes.pop();
                this.instrument.removeChild(note.getRenderedNote());
            }
        }

        getRenderedInstrument() {
            let information = document.createElement('div');
            information.classList.add('information');
            let informationText = document.createElement('p');
            informationText.appendChild(document.createTextNode(this.name));
            information.appendChild(informationText);
            this.instrument.appendChild(information);

            this.notes.forEach(tile => this.instrument.appendChild(tile.getRenderedNote()));

            return this.instrument;
        }
    }

    let bpmToWaitTime = bpm => 60 / bpm / 4 * 1000;

    class Sequencer {
        constructor(sounds, bars, bpm, container) {
            this.sounds = sounds;
            this.barSize = 4;
            this.bars = bars;
            this.bpm = bpm;
            this.waitTime = bpmToWaitTime(this.bpm);

            this.menu = new SequencerMenu(
                this.bpm,
                newValue => this.changeBpm(newValue),
                () => this.addBar(),
                () => this.removeBar(),
                () => this.clearSelection()
            );

            this.container = container;

            this.instruments = [];

            this.context = new AudioContext();
            this.bufferLoader = new BufferLoader(
                this.context,
                this.sounds.map(element => element.file),
                () => {
                    for (let i = 0; i < sounds.length; i++) {
                        let name = sounds[i].name;
                        let sound = this.bufferLoader.bufferList[i];
                        let notes = this.bars * this.barSize;
                        this.instruments.push(new SequencerInstrument(name, sound, this.context, notes));
                    }
                    this.init();
                }
            );

            this.bufferLoader.load();
        }

        changeBpm(newBpm) {
            if (newBpm < 0) return;
            this.bpm = newBpm;
            this.waitTime = bpmToWaitTime(this.bpm);
        }

        playNote(index) {
            this.instruments.map(instrument => instrument.playNote(index));
            setTimeout(() => {
                let notes = this.bars * this.barSize;
                let nextNote = (index + 1) % notes;
                this.playNote(nextNote);
            }, this.waitTime);
        }

        addBar() {
            this.bars += 1;
            this.instruments.map(instrument => instrument.addNotes(this.barSize));
        }

        removeBar() {
            if (this.bars <= 1) {
                return;
            }
            this.bars -= 1;
            this.instruments.map(instrument => instrument.removeNotes(this.barSize));
        }

        clearSelection() {
            this.instruments.map(instrument => instrument.resetNotes());
        }

        getRenderedSequencer() {
            let sequencer = document.createElement('div');
            sequencer.classList.add('drum-pad');

            this.instruments.forEach(instrument => sequencer.appendChild(instrument.getRenderedInstrument()));

            return sequencer;
        }

        init() {
            this.container.appendChild(this.menu.getRenderedMenu());
            this.container.appendChild(this.getRenderedSequencer());
            this.playNote(0);
        }
    }

    return Sequencer;
})(window.AudioContext, window.BufferLoader);