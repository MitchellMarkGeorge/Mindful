import { ActiveElementType } from './../types';
// import { ActiveElementType } from '../types';
// DOCUMENTATION
//should i mearge all function in mindful-class
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

function getStyle(element: HTMLElement, style: string): number {
    return parseFloat(getComputedStyle(element)[style]);
}

export function shouldInsertExtension(activeElement: ActiveElementType): boolean {
    // CONFIRM THIF THIS WORKS
    const fontSize = getStyle((activeElement as HTMLElement), 'fontSize') // think about this. should use some kind of reletive size
    return ((activeElement.tagName === "TEXTAREA" && activeElement.clientWidth > 190 && activeElement.clientHeight > 20) && fontSize < 40 || ( (activeElement as HTMLElement).isContentEditable));   
    // look into wiidth
}



export function isBody(activeElement: ActiveElementType): boolean {
    return document.body.isSameNode(activeElement);
}

export function isAlreadyInserted(activeElement: ActiveElementType): boolean {
    return activeElement?.nextElementSibling?.tagName === 'MINDFUL-EXTENSION' //mindful-extension
} // should just use parent





