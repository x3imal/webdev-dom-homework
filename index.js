import { formatDate } from './modules/formatDate.js'
import { showQuoteBlock } from './modules/showQuoteBlock.js'
import { renderComments } from './modules/renderComments.js'
import { attachCommentReply } from './modules/attachCommentReply.js'
import { attachLikeListeners } from './modules/attachLikeListeners.js'

const commentsList = document.querySelector('.comments')
const button = document.querySelector('.add-form-button')
const input = document.querySelector('.add-form-name')
const textarea = document.querySelector('.add-form-text')

export let comments = [];


function renderAll() {
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
            }),
        attachCommentReply: () =>
            attachCommentReply({ textarea, showQuoteBlock }),
    })
}

button.addEventListener('click', () => {
    input.classList.remove('error')
    textarea.classList.remove('error')

    const name = input.value.trim()
    const text = textarea.value.trim()
    const quote = textarea.dataset.quote || ''
    const quoteAuthor = textarea.dataset.quoteAuthor || ''

    if (!name || !text) {
        alert('Заполни все поля')
        input.classList.add('error')
        textarea.classList.add('error')
        return
    }

    comments.push({
        name: name,
        date: formatDate(new Date()),
        text: text,
        quote: quote,
        quoteAuthor: quoteAuthor,
        likesCount: 0,
        isLiked: false,
    })

    let oldQuote = document.querySelector('.js-quote-block')
    if (oldQuote) oldQuote.remove()

    input.value = ''
    textarea.value = ''
    textarea.quote = ''
    textarea.quoteAuthor = ''

    renderAll()
})

renderAll()
