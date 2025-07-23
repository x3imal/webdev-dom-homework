import { escapeHTML } from './escapeHTML.js'
import { comments } from '../index.js'
import { showQuoteBlock } from './showQuoteBlock.js'

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

    document.querySelectorAll('.like-button').forEach((btn) => {
        btn.addEventListener('click', () => {
            const index = btn.dataset.index
            const comment = comments[index]
            comment.isLiked = !comment.isLiked
            comment.likesCount += comment.isLiked ? 1 : -1
            renderComments()
        })
    })

    document.querySelectorAll('.comment').forEach((el) => {
        el.addEventListener('click', (e) => {
            if (e.target.classList.contains('like-button')) return
            const index = el.dataset.index
            const comment = comments[index]
            textarea.dataset.quote = comment.text
            textarea.dataset.quoteAuthor = comment.name
            showQuoteBlock(comment.text, comment.name, textarea)
            textarea.focus()
        })
    })
}