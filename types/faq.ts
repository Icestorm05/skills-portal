export interface IFaq {
    question: string;
    answers: IFaqAnswer[];
}

export interface IFaqAnswer {
    type: 'p' | 'b' | 'ul' | 'table';
    text: string | string[] | string[][];
}