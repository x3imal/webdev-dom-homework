import { comments } from '../index.js'
import { escapeHTML } from './escapeHTML.js'
import { attachLikeListeners, attachQuoteListeners } from './attachHandlers.js'

export function renderComments() {
    const commentsList = document.querySelector('.comments')
    const textarea = document.querySelector('.add-form-text')
    commentsList.innerHTML = ''
    comments.forEach((comment, index) => {
        const html = `
      <li class="comment" data-index="${index}">
        <div class="comment-header">
          <div>${escapeHTML(comment.name)}</div>
          <div>${escapeHTML(comment.date)}</div>
        </div>
        <div class="comment-body">
          ${comment.quote ? `
            <div class="comment-quote">"${escapeHTML(comment.quote)}"
              <span class="comment-quote-author">(${escapeHTML(comment.quoteAuthor)})</span>
            </div>` : ''}
          <div class="comment-text">${escapeHTML(comment.text)}</div>
        </div>
        <div class="comment-footer">
          <div class="likes">
            <span class="likes-counter">${comment.likesCount}</span>
            <button class="like-button ${comment.isLiked ? '-active-like' : ''}" data-index="${index}"></button>
          </div>
        </div>
      </li>
    `
        commentsList.innerHTML += html
    })

    attachLikeListeners()
    attachQuoteListeners()
}