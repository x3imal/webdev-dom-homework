import { renderComments } from './renderComments.js'

export function attachLikeListeners({
                                        commentsList,
                                        textarea,
                                        showQuoteBlock,
                                        attachLikeListeners,
                                        attachCommentReply,
                                        comments,
                                    }) {
    const likeButtons = document.querySelectorAll('.like-button');

    likeButtons.forEach((button) => {
        button.onclick = () => {
            const index = button.dataset.index;
            const comment = comments[index];

            comment.isLiked = !comment.isLiked;
            comment.likesCount += comment.isLiked ? 1 : -1;

            // перерисовка
            renderComments({
                commentsList,
                textarea,
                showQuoteBlock,
                attachLikeListeners: () =>
                    attachLikeListeners({
                        commentsList,
                        textarea,
                        showQuoteBlock,
                        attachLikeListeners,
                        attachCommentReply,
                        comments,
                    }),
                attachCommentReply: () =>
                    attachCommentReply({ textarea, showQuoteBlock }),
                comments,
            });
        };
    });
}
