import { CurrentStatus } from "./../types";
import {
  ActiveElementType,
  ToxicResult,
  MindfulProps,
  AttachmentStrategy,
} from "../types";

import * as common from "../common/common";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { MindfulComponent } from "./components";
import { getEmojiCode } from "./functions";
export class MidfulExtensionClass {
  mindfulWrapper: HTMLElement;

  // activeElement
  private activeElement: ActiveElementType;

  // CREATE CONSTANTS FOR SPECIAL EMOJI CODE (LIKE DEFAULT OR DISABLED)

  public props: MindfulProps;
  // think about these thrshold values
 
  public SCORE_THRESHOLD = -0.4;
  private score = 0;
  private text: string;

  // experimental
  public getActiveElementPos(): number {
    // for contentedit field
    const activeElement = this.activeElement;
    if ((<HTMLElement>activeElement).isContentEditable) {
      // activeElement.focus() // might not need to
      const _range = document.getSelection().getRangeAt(0);
      const range = _range.cloneRange();
      range.selectNodeContents(activeElement);
      range.setEnd(_range.endContainer, _range.endOffset);
      return range.toString().length;
    }
    // for texterea/input element
    return (<HTMLTextAreaElement>activeElement).selectionStart;
  }

  // turn isEnabled to get function

  public get isMounted(): boolean {
    return !!this.mindfulWrapper;
  }

  public get currentStatus(): Promise<CurrentStatus> {
    console.log(location.href);
    return common.getStatus(location.href);
  }

  public isDomainInBlacklist(blacklist: string[]): boolean {
    const domain = common.getHostDomain(location.href);
    return blacklist.includes(domain);
  }

  

  private async getIsEnabled() {
    try {
      const blacklist = await common.getBlacklist();
      // const domain = common.getHostDomain(location.href);
      // return blacklist.includes(domain);
      return this.isDomainInBlacklist(blacklist);
    } catch (e) {
      console.log(e);
      return true;
    }
  }

  // public get isEnabled(): boolean {
  //     let domain = common.getHostDomain(location.href); // or just use loc
  //     // console.log(!common.getBlacklist().includes(domain))
  //     return !common.getBlacklist().includes(domain);
  // }
  public get ATTACHEMENT_STRATEGY(): AttachmentStrategy {
    return this.mindfulWrapper.style.position === "relative"
      ? AttachmentStrategy.COMPLEX
      : AttachmentStrategy.SIMPLE;
  }
  public mountComponent(emoji: string): void {
    console.log("mounting");
    

    this.mindfulWrapper = document.createElement("mindful-extension");
   

    // THINK ABOIT THIS
    console.log(this.activeElement.clientHeight);
    // also compare size/ height (only for bigger elements that absolute positioning should be useful)
    if (this.activeElement.clientHeight > 40) {
   
      const styleObject = {
        // use strings incase of other css rules
        position: "relative",
        display: "block",
        width: "0",
        height: "0",
        bottom: "2em",
        left: "0.5em",
      };

      for (const style in styleObject) {
        if (styleObject.hasOwnProperty(style)) {
          this.mindfulWrapper.style.setProperty(
            style,
            styleObject[style],
            "important"
          );
        }
      }
    }

    // insertafter - should they be elements
    this.activeElement.parentNode.insertBefore(
      this.mindfulWrapper, // use element
      this.activeElement.nextSibling
    );

    this.props = { emoji };

    // if (props) {
    //     this.props = props
    // }

    this.renderComponent();
    // console.log('here');
  }

  public unWrapElement(el: HTMLElement): void {
    const parent = el.parentNode;

    // move all children out of the element
    while (el.firstChild) parent.insertBefore(el.firstChild, el);

    // remove the empty element
    parent.removeChild(el); // OR el.remove()
  }

  public getActiveElementStyles(): CSSStyleDeclaration {
    return window.getComputedStyle(this.activeElement);
  }

  public wrapActiveElement(
    activeElement: ActiveElementType,
    wrapper: HTMLElement
  ): void {
    activeElement.parentNode.insertBefore(wrapper, activeElement);
    wrapper.appendChild(activeElement);
  }

  public unmountComponent(): void {
    // re-consider order
    ReactDOM.unmountComponentAtNode(this.mindfulWrapper);

    this.mindfulWrapper.remove(); // should i remove ore leave if re-attached
    this.mindfulWrapper = null;
  }

  public updateProps(props: MindfulProps): void {
    console.log("update to props");
    Object.assign(this.props, props);
    this.renderComponent();
  }

  public renderComponent(): void {
    const componentInstance = React.createElement(MindfulComponent, this.props);
    console.log(this.mindfulWrapper);
    ReactDOM.render(componentInstance, this.mindfulWrapper);
  }

  public setScore(score: number): void {
    this.score = score;
    // this.updateProps({ emoji: this.getEmojiFromScore(score) })
  }

  public getEmojiFromScore(score: number): string {
    const emojicode = getEmojiCode(score);
    return String.fromCodePoint(emojicode);
  }

  public getDefaultEmoji(): string {
    return String.fromCodePoint(128528);
  }

  // public getDisabledEmoji(): string {
  //   return String.fromCodePoint(128274);
  // }

  public getToxicityList(response: ToxicResult[]): string[] {
    return response
      .filter((item) => item?.results[0]?.match)
      .map((item) => item.label.replace("_", " "));

    
  }

  setActiveElement(activeElement: ActiveElementType): void {
    this.activeElement = activeElement;
    // this.previousActiveElement = activeElement;
  }

  getActiveElement(): ActiveElementType {
    return this.activeElement;
  }

  getText(): string {
    return this.text;
  }

  // getDefaultEmoji(): string {
  //     return this.getEmoji(128528)
  // }

  setEmojiAsDefault() {
    this.getEmoji(128528);
  }

  getBadKeys(): string[] {
    return [
      "f1",
      "f2",
      "f3",
      "f4",
      "f5",
      "f6",
      "f7",
      "f8",
      "f9",
      "f10",
      "f11",
      "f12",
      "audiovolumemute",
      "audiovolumedown",
      "arrowright",
      "arrowleft",
      "arrowdown",
      "arrowup",
      "audiovolumeup",
      "mediaplaypause",
      "mediatracknext",
      "mediatrackprevious",
      "capslock",
      "printscreen",
      "home",
      "end",
      "pageup",
      "pagedown",
      "numlock",
      "clear",
      "escape",
    ]; // 'alt', 'shift', 'control', 'meta', 'scrolllock', 'symbol', 'symbollock'
  }

  setText(text: string) {
    this.text = text;
  }

  getEmoji(emojiNumber: number): string {
    //
    return String.fromCodePoint(emojiNumber);
  }

  getScore(): number {
    return this.score;
  }
}
