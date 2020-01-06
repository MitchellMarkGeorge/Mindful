export class MidfulExtensionClass {

    wrapperDiv;
    emojiElement;
    // progressBarElement;
    // progressBar;
    loadingElement;

    constructor() {

        // this.wrapperDiv;
        // this.emojiElement;
        // this.progressBarElement;

        

    }

    setValues(DOMElement) {
        this.wrapperDiv = DOMElement.firstChild;
        this.emojiElement = this.wrapperDiv.firstChild;
        this.loadingElement = this.wrapperDiv.lastChild;

        // this.progressBar = new ProgressBar.Line(this.getProgressBarElement(), {
        //     strokeWidth: 4,
        //     easing: 'easeInOut',
        //     duration: 1400,
        //     color: '#FFEA82',
        //     trailColor: '#eee',
        //     trailWidth: 1,
        //     svgStyle: { width: '50px' }
        //   });
        console.log(this.wrapperDiv);
        //console.log(this.progressBarElement);
        console.log(this.emojiElement);
        console.log(this.loadingElement)
    }


    getEmojiElement() {
        return this.emojiElement;
    }

    setEmojiElementContent(emojiNumber) {
        
        this.emojiElement.innerHTML = String.fromCodePoint(emojiNumber);
    }

    // getProgressBarElement() {
    //     return this.progressBarElement;
    // }

    getWrapperDiv() {
        return this.wrapperDiv;
    }

    setWrapperDivID(idString) {
        this.wrapperDiv.id = idString
    }

    setSpanElementClassName(className) {
        //this.emojiElement.classList.add(className);
        this.loadingElement.classList.add(className);
     }
} 
