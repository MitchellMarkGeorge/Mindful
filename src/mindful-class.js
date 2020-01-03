export class MidfulExtensionClass {

    wrapperDiv;
    emojiElement;
    progressBarElement

    constructor(DOMElement) {

        // this.wrapperDiv;
        // this.emojiElement;
        // this.progressBarElement;

        this.setValues(DOMElement)

    }

    setValues(DOMElement) {
        this.wrapperDiv = DOMElement.firstChild;
        this.emojiElement = this.wrapperDiv.firstChild;
        this.progressBarElement = this.wrapperDiv.lastChild;
        console.log(this.wrapperDiv);
        console.log(this.progressBarElement);
        console.log(this.emojiElement);
    }


    getEmojiElement() {
        return this.emojiElement;
    }

    setEmojiElementContent(emojiNumber) {
        console.log(this.emojiElement);
        this.emojiElement.innerHTML = String.fromCodePoint(emojiNumber);
    }

    getProgressBarElement() {
        return this.progressBarElement;
    }

    getWrapperDiv() {
        return this.wrapperDiv;
    }

    setWrapperDivID(idString) {
        this.wrapperDiv.id = idString
    }

    setProgressBarElement() { }
}
