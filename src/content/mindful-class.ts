import { ActiveElementType, ToxicResult, ToxicAPIResponse, MindfulProps } from '../types';

// import common from '../common/common'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { MindfulComponent } from './components'
import { getEmojiCode } from './functions';
export class MidfulExtensionClass {

    mindfulWrapper: HTMLElement
    mindfulContainer: HTMLElement
    // activeElement
    private currentActiveElement: ActiveElementType
    wrapperDiv: Element;
    emojiElement: Element;
    errorElement: Element;
    loadingElement: Element;
    previousMindfulWraper: Element;
    previousActiveElement: Element
    tocicityElements: HTMLSpanElement[] = [];

    private DEFAULT_EMOJICODE;
    // CREATE CONSTANTS FOR SPECIAL EMOJI CODE (LIKE DEFAULT OR DISABLED)

    public props: MindfulProps
    // think about these thrshold values
    public TOXIC_THRESHOLD: number = 0.75
    public SCORE_THRESHOLD: number = -0.4
    private score: number = 0;
    private text: string
    // public isEnabled: boolean // default shoud be true??
    // API_URL: string = 'https://us-central1-mindful-279120.cloudfunctions.net/advanced-analysis'

    constructor() {
        // let domain = common.getHostDomain(currentURL);
        // console.log(!common.getBlacklist().includes(domain))
        // this.isEnabled = !common.getBlacklist().includes(domain);

    }

    // turn isEnabled to get function

    public get isMounted(): boolean {
        return !!this.mindfulWrapper;
    }

    // public get isEnabled(): boolean {
    //     let domain = common.getHostDomain(location.href); // or just use loc
    //     // console.log(!common.getBlacklist().includes(domain))
    //     return !common.getBlacklist().includes(domain);
    // }

    public mountComponent(props: MindfulProps = {}) {

        // console.log(this.currentActiveElement.clientHeight);
        // container messes up grammarly
        // figure out

        // change order


        // this.currentActiveElement.parentElement.insertBefore(mindfulContainer, this.currentActiveElement);
        // mindfulContainer.appendChild(this.currentActiveElement);

        this.mindfulWrapper = document.createElement("mindful-extension");
        // this.previousMindfulWraper = this.mindfulWrapper;

        // THINK ABOIT THIS
        //  mindfulWrapper.style.margin = window.getComputedStyle(this.activeElement).padding;
        // also compare size/ height (only for bigger elements that absolute positioning should be usef)
        if (props.computedStyle && this.currentActiveElement.clientHeight > 40) {
            // figure outfinal values

            this.mindfulContainer = document.createElement("mindful-container");

            console.log(props.computedStyle.padding);
            // figure margin out
            // this.mindfulWrapper.style.margin = !props.computedStyle.padding.includes('0px') ? props.computedStyle.padding : '10px' // default value of 10px
            this.mindfulWrapper.style.position = 'absolute'; // try relative
            // needts to be on the element itself
            // mindfulWrapper.style.bottom = props.computedStyle.paddingBottom; // was 0
            // this.mindfulWrapper.style.bottom = '0'; // maybey i should use top
            // this.mindfulWrapper.style.left = '0';

            this.mindfulWrapper.style.bottom = '1em'; // maybey i should use top
            this.mindfulWrapper.style.left = '1em';
            // think about this
            // this.mindfulWrapper.style.top =    `calc(-0.2 * ${props.computedStyle.height})`
            // this.mindfulWrapper.style.right =    `calc(0.8 * ${props.computedStyle.width})`
            // console.log(props.computedStyle.height);

            this.wrapActiveElement(this.currentActiveElement, this.mindfulContainer);

            this.mindfulContainer.appendChild(this.mindfulWrapper);
        } else {

            // insertafter - should they be elements
            this.currentActiveElement.parentNode.insertBefore(
                this.mindfulWrapper, // use element
                this.currentActiveElement.nextSibling
            );
        }


        // this.curr





        // this.mindfulWrapper = mindfulWrapper;

        this.props = props;

        // if (props) {
        //     this.props = props
        // }

        this.renderComponent();
        // console.log('here');

    }



    public unWrapElement(el: HTMLElement) {

        let parent = el.parentNode;

        // move all children out of the element
        while (el.firstChild) parent.insertBefore(el.firstChild, el);

        // remove the empty element
        parent.removeChild(el); // OR el.remove()

    }

    public wrapActiveElement(activeElement: ActiveElementType, wrapper: HTMLElement) {

        activeElement.parentNode.insertBefore(wrapper, activeElement);
        wrapper.appendChild(activeElement);

    }

    public unmountComponent() {
        // re-consider order 
        ReactDOM.unmountComponentAtNode(this.mindfulWrapper);

        if (this.mindfulContainer) { // incase the second attachment option is used
            this.unWrapElement(this.mindfulContainer);
            this.mindfulContainer = null;
        }

        this.mindfulWrapper.remove(); // should i remove ore leave if re-attached
        this.mindfulWrapper = null;



    }

    public updateProps(props: MindfulProps) {
        Object.assign(this.props, props);
        this.renderComponent();
    }

    public renderComponent() {

        const componentInstance = React.createElement(MindfulComponent, this.props);
        ReactDOM.render(componentInstance, this.mindfulWrapper);

    }

    public setScore(score: number) {
        this.score = score
        // this.updateProps({ emoji: this.getEmojiFromScore(score) })
    }

    public getEmojiFromScore(score: number) {
        const emojicode = getEmojiCode(score);
        return String.fromCodePoint(emojicode)
    }



    public getDefaultEmoji() {
        return String.fromCodePoint(128528)
    }

    public getDisabledEmoji() {
        return String.fromCodePoint(128274)
    }

    public getToxicityList(response: ToxicResult[]): string[] {
        return response.filter((item) => item.prediction >= this.TOXIC_THRESHOLD)
            .map((item) => item.label.replace('_', ' '))

        // response..map((item) => item.label.replace('_', ' '))
    }
    // constructor() {

    //     // this.wrapperDiv;
    //     // this.emojiElement;
    //     // this.errorElement;
    //     // this.loadingElement;
    //     // this.previousMindfulWraper;
    //     // this.previousActiveElement;
    //     // // this.state;
    //     // this.tocicityElements = [];

    // }

    // setReferences

    setValues(DOM_Element: HTMLElement | Element, activeElement: ActiveElementType) { // should i store the previousMindfulWraper activeElement?
        this.wrapperDiv = DOM_Element.firstElementChild;
        this.emojiElement = this.wrapperDiv.firstElementChild;

        this.loadingElement = this.wrapperDiv.lastElementChild;
        this.previousMindfulWraper = DOM_Element;
        this.previousActiveElement = activeElement
        console.log(this.wrapperDiv);

        console.log(this.emojiElement);
        console.log(this.loadingElement)
    }

    setActiveElement(activeElement: ActiveElementType) {
        this.currentActiveElement = activeElement;
        // this.previousActiveElement = activeElement;
    }

    getActiveElement(): ActiveElementType {
        return this.currentActiveElement
    }

    getText(): string {
        return this.text
    }

    // getDefaultEmoji(): string {
    //     return this.getEmoji(128528)
    // }

    setEmojiAsDefault() {
        this.getEmoji(128528)
    }

    getBadKeys(): string[] {
        return ['f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'f9', 'f10', 'f11', 'f12', 'audiovolumemute', 'audiovolumedown', 'arrowright', 'arrowleft', 'arrowdown', 'arrowup', 'audiovolumeup', 'mediaplaypause', 'mediatracknext', 'mediatrackprevious', 'capslock', 'printscreen', 'home', 'end', 'pageup', 'pagedown', 'numlock', 'clear', 'escape']// 'alt', 'shift', 'control', 'meta', 'scrolllock', 'symbol', 'symbollock'
    }

    setText(text: string) {
        this.text = text
    }

    removePreviousMindfulWraper() {
        this.previousMindfulWraper.remove();
    }

    getEmojiElement() {
        return this.emojiElement;
    }

    getEmoji(emojiNumber: number): string {
        // 
        return String.fromCodePoint(emojiNumber);
    }



    getScore(): number {
        return this.score
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

    setToxicityElements(toxicityArray: ToxicResult[]) {
        if (this.errorElement) {
            this.removeErrorElement() // should groupt in div
        }
        // in case there is any elements for anu reason

        // for example cold cloud function boot times
        if (this.tocicityElements.length > 0) {
            this.removeToxicityElements();
        }

        let tempArray = toxicityArray.filter(item => item.prediction >= this.TOXIC_THRESHOLD)
        // let tempArray = toxicityArray.filter(item => item.results[0].match === true);

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
            // USE ELEMENTS
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


    // ????????????
    setToxicityElementClass(className) {
        this.loadingElement.classList.add(className);
        console.log(className); //
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

    createErrorElement(specialMessage: string = 'Unavalible') {
        let text = specialMessage
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
