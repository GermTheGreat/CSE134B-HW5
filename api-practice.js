const sampleDogs = [
    { url: "https://images.dog.ceo/breeds/briard/n02105251_6667.jpg", breed: "Briard" },
    { url: "https://images.dog.ceo/breeds/borzoi/n02090622_855.jpg", breed: "Borzoi" },
    { url: "https://images.dog.ceo/breeds/groenendael/n02105056_2685.jpg", breed: "Groenendael" },
];
class DogViewer extends HTMLElement {
    constructor() {
        super();
        this.currentIndex = 0;
        //this.state = 'idle';
        //this.currentDog = sampleDogs[0];
    }

    connectedCallback() {
        if(this.status){
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
            this.currentIndex = (this.currentIndex + 1) % sampleDogs.length;
            this.render();
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
        this.status.textContent = `Dog ${this.currentIndex + 1} of ${sampleDogs.length}`;
        this.dogImage.src = sampleDogs[this.currentIndex].url;
        this.dogImage.alt = sampleDogs[this.currentIndex].breed;
        this.description.textContent = sampleDogs[this.currentIndex].breed;
        if(this.hasAttribute('compact')) {
            this.description.hidden = true;
        } else {
            this.description.hidden = false;
        }
    }
}

const dogViewer = document.querySelector('dog-viewer');
const switchDogViewerButton = document.querySelector('#switch-dog-viewer');

switchDogViewerButton.addEventListener('click', () => {
    dogViewer.toggleAttribute('compact');
    updateToggleButton();
});

function updateToggleButton() {
    if(dogViewer.hasAttribute('compact')) {
        switchDogViewerButton.textContent = 'Switch to Full';
    } else {
        switchDogViewerButton.textContent = 'Switch to Compact';
    }
}

updateToggleButton();

customElements.define('dog-viewer', DogViewer);