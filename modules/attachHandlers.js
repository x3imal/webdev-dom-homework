import { comments } from '../index.js'
import { renderComments } from './renderComments.js'
import { showQuoteBlock } from './showQuoteBlock.js'

export function attachLikeListeners() {
    document.querySelectorAll('.like-button').forEach((btn) => {
        btn.onclick = () => {
            const idx = btn.dataset.index
            const c = comments[idx]
            c.isLiked = !c.isLiked
            c.likesCount += c.isLiked ? 1 : -1
            renderComments()
        }
    })
}

export function attachQuoteListeners() {
    const textarea = document.querySelector('.add-form-text')
    document.querySelectorAll('.comment').forEach((li) => {
        li.onclick = (e) => {
            if (e.target.classList.contains('like-button')) return
            const idx = li.dataset.index
            const c = comments[idx]
            textarea.dataset.quote = c.text
            textarea.dataset.quoteAuthor = c.name
            showQuoteBlock(c.text, c.name, textarea)
            textarea.focus()
        }
    })
}

export function attachAddCommentHandler(handler) {
    const button = document.querySelector('.add-form-button')
    button.onclick = handler
}