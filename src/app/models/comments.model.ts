import { Author } from "./authur.model";

export interface Comment {
    text: string,
    rate: number,
    author: Author
}