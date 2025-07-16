import {comments} from "../index.js";

export function attachCommentReply({ textarea, showQuoteBlock }) {
    document.querySelectorAll('.comment').forEach((li) => {
        li.onclick = function (e) {
            if (e.target.classList.contains('like-button')) return
            const idx = li.getAttribute('data-index')
            const c = comments[idx]
            textarea.value = ''
            textarea.dataset.quote = c.text
            textarea.dataset.quoteAuthor = c.name
            showQuoteBlock(c.text, c.name, textarea)
            textarea.focus()
        }
    })
}
