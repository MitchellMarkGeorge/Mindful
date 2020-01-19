export class MidfulExtensionClass {

    wrapperDiv;
    emojiElement;
    // progressBarElement;
    // progressBar;
    loadingElement;
    tocicityElements = [];

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
         let tempArray = toxicityArray.filter(item => item.results[0].match === true);

         console.log(tempArray);

         this.tocicityElements = tempArray.map(item => {
             let element = document.createElement('span');
             element.className = 'mindful-span-toxicity-elements'
             element.innerHTML = `${item.label.replace('_', ' ')}`; // add percentage???
             return element;
         })

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


 
     setToxicityElementClass(className) {
        this.loadingElement.classList.add(className);
        console.log(className);
     }

     getLoadingElement() {
         return this.loadingElement;
     }
} 
