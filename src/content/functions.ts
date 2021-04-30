import { ActiveElementType } from './../types';

// DOCUMENTATION

/**
 * @param {string}  score score to be coverted to emoji
 * @return {number} the emojicode to be rendered
 */

export function getEmojiCode(score: number): number {
    if (score > 0.8) return 128525;
    else if (score > 0.6) return 128512;
    else if (score > 0.4) return 128578;
    else if (score < 0 && score > -0.4) return 128528;
    else if (score < 0 && score > -0.6) return 128577;
    else if (score < 0 && score > -0.8) return 128551;
    // could also use '128550'??? include this one
    else if (score < -0.8) return 128552;

    else return 128528; // default score
}

export function getVisibleTypingArea(activeElement: ActiveElementType, extensionElement: HTMLElement): number {
    const takenArea = getStyle(extensionElement, 'fontSize') * 2
    return activeElement.clientHeight - takenArea;
}

export function getStyle(element: HTMLElement, style: string): number {
    return parseFloat(getComputedStyle(element)[style]);
}

export function shouldInsertExtension(activeElement: ActiveElementType): boolean {
    // CONFIRM THIF THIS WORKS
    // console.log('marginBottom', getStyle((activeElement as HTMLElement), 'marginBottom'));
    const fontSize = getStyle((activeElement as HTMLElement), 'fontSize') // think about this. should use some kind of reletive size
    return ((isTextArea(activeElement) && activeElement.clientWidth > 190 && activeElement.clientHeight > 20) && fontSize < 40 || ( (activeElement as HTMLElement).isContentEditable));   
    // look into wiidth
}

export function isTextArea(activeElement: ActiveElementType): boolean {
    return (<HTMLTextAreaElement>activeElement).tagName === "TEXTAREA"
}



export function isBody(activeElement: ActiveElementType): boolean {
    return document.body.isSameNode(activeElement);
}

export function isAlreadyInserted(activeElement: ActiveElementType): boolean {
    return activeElement?.nextElementSibling?.tagName === 'MINDFUL-EXTENSION' //mindful-extension
} // should just use parent





