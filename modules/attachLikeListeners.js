import { comments} from "../index.js";
import { renderComments } from './renderComments.js'

export function attachLikeListeners({
    commentsList,
    textarea,
    showQuoteBlock,
    attachLikeListeners,
    attachCommentReply,
}) {
    const likeButtons = document.querySelectorAll('.like-button')
    likeButtons.forEach((button) => {
        button.onclick = () => {
            const index = button.dataset.index
            const comment = comments[index]

            comment.isLiked = !comment.isLiked
            comment.likesCount += comment.isLiked ? 1 : -1

            renderComments({
                commentsList,
                textarea,
                showQuoteBlock,
                attachLikeListeners,
                attachCommentReply,
            })
        }
    })
}
