import { MindfulProps, ToxicityElementProps } from '../types';
import * as React from "react";
import { Popover } from 'antd';
// import './content.css'
{/* <Popover/> */}


export const MindfulComponent: React.FC<MindfulProps> = ({ emoji, hasError, toxicityList, isLoading, computedStyle, enableFunc }) => {
    // in tooltip, if disbabled and switch is fliped, call enableFunc
    return <div id="mindful-wrapper"  >
        <span className="mindful-span-elements">{emoji}</span>
        {/* Emoji */}
        <div className="mindful-span-elements"></div>
        {/* Loader */ }

        {toxicityList?.length > 0 && <ToxicityElements toxicityList={toxicityList}/>}
    </div >
}


export const ToxicityElements = (props: ToxicityElementProps) => {
    return <> 
    {props.toxicityList.map((item, index) => <span key={index}>{item}</span>)} 
    </>
}