export interface IGratitude {
    id: number;
    color: string;
    category: string;
    title: IWord[];
    description: string;
}

interface IWord {
    text: string;
    isColored: boolean;
}