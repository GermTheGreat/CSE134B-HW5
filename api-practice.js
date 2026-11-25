const STORAGE_KEY = 'hw5-dog-viewer-mode';
const COMPACT_MODE = 'compact';
const EXPAND_MODE = 'expand';
const DEFAULT_MODE = EXPAND_MODE;

class DogViewer extends HTMLElement {
    constructor() {
        super();
        this.state = 'idle';
        this.currentDog = null;
    }

    connectedCallback() {
        if (this.status) {
            return;
        }

        this.heading = document.createElement('h3');
        this.heading.textContent = 'Dog Viewer';

        this.dogImage = document.createElement('img');

        this.description = document.createElement('p');

        this.button = document.createElement('button');
        this.button.textContent = 'Next Dog';
        this.button.setAttribute('type', 'button');
        this.button.addEventListener('click', () => {
            this.fetchDog();
        });

        this.status = document.createElement('p');
        this.status.setAttribute('role', 'status');

        this.render();

        this.appendChild(this.heading);
        this.appendChild(this.dogImage);
        this.appendChild(this.description);
        this.appendChild(this.button);
        this.appendChild(this.status);
    }

    static get observedAttributes() {
        return ["compact"];
    }

    attributeChangedCallback() {
        if(this.status){
            this.render();
        }
    }

    render() {
        this.status.setAttribute('data-state', this.state);
        if (this.state === 'error'){
            this.status.textContent = "Error fetching dog. Please try again.";
            this.button.disabled = false;
        } else if (this.state === 'loading') {
            this.status.textContent = "Fetching dog...";
            this.button.disabled = true;
        } else if (this.state === 'success') {
            this.status.textContent = "Dog successfully fetched.";
            this.button.disabled = false;
        } else {
            this.status.textContent = "Waiting for dog to be fetched.";
            this.button.disabled = false;
        }
        if (this.currentDog) {
            this.dogImage.src = this.currentDog.url;
            this.dogImage.alt = `A photo of a ${this.currentDog.breed} dog`;
            this.description.textContent = this.currentDog.breed;
            this.dogImage.hidden = false;
        } else {
            this.dogImage.hidden = true;
        }
        if (this.hasAttribute('compact') || !this.currentDog) {
            this.description.hidden = true;
        } else {
            this.description.hidden = false;
        }
    }

    async fetchDog() {
        this.state = 'loading';
        this.render();
        try {
            const response = await fetch("https://dog.ceo/api/breeds/image/random");
            if (!response.ok) {
                throw new Error(`HTTP status ${response.status}`);
            }

            const data = await response.json();
            if (typeof data?.message !== "string") {
                throw new Error("Expected a string in the response.");
            }

            const dogUrl = new URL(data.message);
            if (dogUrl.protocol !== "https:") {
                throw new Error("Expected an HTTPS image URL.");
            }
            const segments = dogUrl.pathname.split('/').filter(Boolean);
            const breed = segments[1] ?? "Unknown breed";

            this.currentDog = {
                url: dogUrl.href,
                breed: breed
            };

            this.state = 'success';
            this.render();

        } catch (error) {
            console.error("Could not fetch the dog.", error);
            this.state = 'error';
            this.render();
        }
    }
}

const dogViewer = document.querySelector('dog-viewer');
const switchDogViewerButton = document.querySelector('#switch-dog-viewer');

function readMode() {
    try {
        const mode = localStorage.getItem(STORAGE_KEY);
        if (mode === COMPACT_MODE || mode === EXPAND_MODE) {
            return mode;
        }
    } catch (error) {
        console.error("Could not read the mode from localStorage.", error);
    }
    return DEFAULT_MODE;
}

function saveMode(mode) {
    try {
        localStorage.setItem(STORAGE_KEY, mode);
    } catch (error) {
        console.error("Could not save the mode to localStorage.", error);
    }
}

switchDogViewerButton.addEventListener('click', () => {
    dogViewer.toggleAttribute('compact');
    updateToggleButton();
    saveMode(dogViewer.hasAttribute('compact') ? COMPACT_MODE : EXPAND_MODE);
});

function updateToggleButton() {
    if (dogViewer.hasAttribute('compact')) {
        switchDogViewerButton.textContent = 'Switch to Full';
    } else {
        switchDogViewerButton.textContent = 'Switch to Compact';
    }
}

const currentMode = readMode();
if (currentMode === COMPACT_MODE) {
    dogViewer.setAttribute('compact', '');
} else {
    dogViewer.removeAttribute('compact');
}

updateToggleButton();

customElements.define('dog-viewer', DogViewer);