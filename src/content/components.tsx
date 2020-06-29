import { MindfulProps, ToxicityElementProps } from '../types';
import * as React from "react";
// import { Popover } from 'antd';
import './content.css'
{/* <Popover/> */}
// console.log()

export const MindfulComponent: React.FC<MindfulProps> = ({ emoji, hasError, toxicityList, isLoading }) => {
    // in tooltip, if disbabled and switch is fliped, call enableFunc
    return <div id="mindful-wrapper">

        
            <span className="mindful-span-elements">{emoji}</span>
        
        
        {/* Emoji */}
        {isLoading && <Loader/>}
        {/* Loader */ }
        {hasError && <Pill text='Unavalible'/>}
        {toxicityList?.length > 0 && <ToxicityElements toxicityList={toxicityList}/>}
    </div >
}


const ToxicityElements = (props: ToxicityElementProps) => {
    return <> 
        {props.toxicityList.map((item, index) => <Pill key={index} text={item}/>)} 
    </>
}

const Pill = ({ text }) => {
    return <span className='mindful-red-pill'>{text}</span>
}

const Loader = () => {
    return <div className="mindful-span-elements la-ball-clip-rotate">
        <div></div> 
        {/* needs child div to show properly */}
    </div>
}

