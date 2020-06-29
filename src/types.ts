// export interface ToxicResult {

import { AxiosError } from "axios";

// }

export type ActiveElementType = Element | HTMLElement | HTMLTextAreaElement

export interface MindfulProps {
    emoji?: string
    isLoading?: boolean,
    hasError?: boolean
    toxicityList?: string[], 
    // margin?: string,
    computedStyle?: CSSStyleDeclaration
    // enableFunc?: () => void
    // disableFunc?: () => void
    // isEnabled?: boolean

}

export interface CurrentStatus {
    isEnabled?: boolean,
    domain?: string
}

export interface ToxicityElementProps {
    toxicityList: string[]
}

export interface SentimentAnalysisResult { 
    neg: number, 
    neu: number, 
    pos: number, 
    compound: number 
}

export interface ToxicResult {
    label: string,
    prediction: number
}

export interface ToxicAPIResponse {
    prediction: ToxicResult[]
}

export interface RequestError {
    error: true,
    body: AxiosError

}



// type for HTMLElement | Element