import { getComments, postComment } from './modules/commentsApi.js'
import { renderComments } from './modules/renderComments.js'

export let comments = []

const input = document.querySelector('.add-form-name')
const textarea = document.querySelector('.add-form-text')

function loadComments() {
    return getComments().then((data) => {
        comments = data.map((c) => ({
            ...c,
            name: c.author.name,
            date: new Date(c.date).toLocaleString(),
            quote: '',
            quoteAuthor: '',
            likesCount: c.likes ?? 0,
            isLiked: false,
        }))
        renderComments()
    })
}

document.querySelector('.add-form-button').addEventListener('click', async () => {
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

    try {
        await postComment({ name, text })

        comments.push({
            name,
            text,
            quote,
            quoteAuthor,
            date: new Date().toLocaleString(),
            likesCount: 0,
            isLiked: false,
        })

        input.value = ''
        textarea.value = ''
        textarea.dataset.quote = ''
        textarea.dataset.quoteAuthor = ''
        const oldQuote = document.querySelector('.js-quote-block')
        if (oldQuote) oldQuote.remove()

        renderComments()
    } catch (e) {
        alert('Ошибка при отправке: ' + e.message)
    }
})

loadComments()