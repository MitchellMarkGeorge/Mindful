import { MindfulProps, ToxicityElementProps } from '../types';
import * as React from "react";
// import './content.css'



export const MindfulComponent: React.FC<MindfulProps> = ({ emoji, hasError, toxicityList, isLoading, computedStyle }) => {

    return <div id="mindful-wrapper" style={{ margin: computedStyle.padding }} >
        <span className="mindful-span-elements">{emoji}</span>
        {/* Emoji */}
        <div className="mindful-span-elements"></div>
        {/* Loader */ }

        {toxicityList.length > 0 && <ToxicityElements toxicityList={toxicityList}/>}
    </div >
}


export const ToxicityElements = (props: ToxicityElementProps) => {
    return <> 
    {props.toxicityList.map((item, index) => <span key={index}></span>)} 
    </>
}