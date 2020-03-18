export class MidfulExtensionClass {

    constructor() {

        this.wrapperDiv;
        this.emojiElement;
        this.errorElement;
        this.loadingElement;
        this.previous;
        
        this.tocicityElements = [];

    }

    setValues(DOM_Element) { // should i store the previous activeElement?
        this.wrapperDiv = DOM_Element.firstChild;
        this.emojiElement = this.wrapperDiv.firstChild;
        this.loadingElement = this.wrapperDiv.lastChild;
        this.previous = DOM_Element;
        console.log(this.wrapperDiv);

        console.log(this.emojiElement);
        console.log(this.loadingElement)
    }

    removePrevious() {
        this.previous.remove();
    }

    getEmojiElement() {
        return this.emojiElement;
    }

    setEmojiElementContent(emojiNumber) {

        this.emojiElement.textContent = String.fromCodePoint(emojiNumber);
    }

    getWrapperDiv() {
        return this.wrapperDiv;
    }

    setWrapperDivID(idString) {
        this.wrapperDiv.id = idString
    }

    setSpanElementClassName(className) {
        // check if it aleready contains it
        this.emojiElement.classList.add(className);
        this.loadingElement.classList.add(className); // , 'mindful-span-toxicity-elements'

    }

    setToxicityElements(toxicityArray) {
        if (this.errorElement) {
            this.removeErrorElement()
        }
        // in case there is any elements for anu reason
        // if (this.tocicityElements.length > 0) {
        //     this.removeToxicityElements()
        // }
        let tempArray = toxicityArray.filter(item => item.results[0].match === true);

        console.log(tempArray);

        this.tocicityElements = tempArray.map(item => {
            let element = document.createElement('span');
            element.className = 'mindful-span-toxicity-elements'
            element.textContent = item.label.replace('_', ' '); // add percentage???
            return element;
        })

        // might wrap in a div

        console.log(this.tocicityElements);

        for (let item of this.tocicityElements) {
            // insert all toxicity elements after emoji element
            this.emojiElement.parentNode.insertBefore(
                item,
                this.emojiElement.nextSibling
            );
        }
    }

    removeToxicityElements() {

        for (let element of this.tocicityElements) {
            element.remove(); // removes element??
        }
        // reset array
        this.tocicityElements = [];

    }

    isLoaderSpinning() {
        return this.loadingElement.classList.contains("la-ball-clip-rotate");
    }

    addLoaderSpinner() {
        this.getLoadingElement().classList.add("la-ball-clip-rotate");
    }



    setToxicityElementClass(className) {
        this.loadingElement.classList.add(className);
        console.log(className);
    }

    getLoadingElement() {
        return this.loadingElement;
    }

    removeErrorElement() {

        this.errorElement.remove();
        this.errorElement = undefined;

    }

    removeLoadingSpinner() {
        this.getLoadingElement().classList.remove("la-ball-clip-rotate");
    }

    createErrorElement(specialMessage) {
        let text = specialMessage || 'Unavalible'
        // the emoji element must be attached
        if (this.getEmojiElement() && !this.errorElement) {
            if (this.tocicityElements.length > 0) {
                this.removeToxicityElements();
            }
            if (this.isLoaderSpinning()) {
                // this.getLoadingElement().classList.remove("la-ball-clip-rotate");
                this.removeLoadingSpinner();
            }


            this.errorElement = document.createElement('span');
            this.errorElement.className = 'mindful-error-element'; // might change className
            this.errorElement.textContent = text;
            this.emojiElement.parentNode.insertBefore(
                this.errorElement,
                this.emojiElement.nextSibling
            );
        }
    }
} 
