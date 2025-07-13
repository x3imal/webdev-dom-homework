import {escapeHTML} from "./escapeHTML.js";
import {comments} from "./commentsData.js";

export function renderComments({commentsList, textarea, showQuoteBlock, attachLikeListeners, attachCommentReply}) {
    commentsList.innerHTML = "";
    comments.forEach((comment, index) => {
        const commentHtml = `
      <li class="comment" data-index="${index}">
        <div class="comment-header">
          <div>${escapeHTML(comment.name)}</div>
          <div>${escapeHTML(comment.date)}</div>
        </div>
        <div class="comment-body">
    ${comment.quote
            ? `<div class="comment-quote">"${escapeHTML(comment.quote)}" <span class="comment-quote-author">(${escapeHTML(comment.quoteAuthor)})</span></div>`
            : ''}
    <div class="comment-text">${escapeHTML(comment.text)}</div>
</div>

        <div class="comment-footer">
          <div class="likes">
            <span class="likes-counter">${comment.likesCount}</span>
            <button class="like-button ${comment.isLiked ? '-active-like' : ''}" data-index="${index}"></button>
          </div>
        </div>
      </li>
    `;
        commentsList.innerHTML += commentHtml;
    });
    attachLikeListeners();
    attachCommentReply();
}
