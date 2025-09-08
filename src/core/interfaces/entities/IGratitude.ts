export interface IGratitude {
    id: number;
    color: string;
    title: IWord[];
    description: string;
}

interface IWord {
    text: string;
    isColored: boolean;
}