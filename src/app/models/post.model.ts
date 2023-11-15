import { Comment } from "./comments.model"
import { Author } from "./authur.model"

export interface Post {
    id: string,
    title: string,
    description: string,
    location: string,
    image: string,
    lucky: number,
    comments: Comment[],
    author: Author
}