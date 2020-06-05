// export interface ToxicResult {

import { AxiosError } from "axios";

// }

export type ActiveElementType = Element | HTMLElement | HTMLTextAreaElement

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