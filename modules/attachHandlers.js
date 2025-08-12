import { comments } from '../index.js'
import { renderComments } from './renderComments.js'
import { showQuoteBlock } from './showQuoteBlock.js'
import {postComment} from "./commentsApi.js";

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

export function attachAddCommentHandler() {
    const input = document.querySelector('.add-form-name');
    const textarea = document.querySelector('.add-form-text');
    const button = document.querySelector('.add-form-button');

    button.addEventListener('click', async () => {
        input.classList.remove('error');
        textarea.classList.remove('error');

        const name = input.value.trim();
        const text = textarea.value.trim();
        const quote = textarea.dataset.quote || '';
        const quoteAuthor = textarea.dataset.quoteAuthor || '';

        if (!name || !text) {
            alert('Заполни все поля');
            input.classList.add('error');
            textarea.classList.add('error');
            return;
        }

        try {
            await postComment({ name, text });

            comments.push({
                name,
                text,
                quote,
                quoteAuthor,
                date: new Date().toLocaleString(),
                likesCount: 0,
                isLiked: false,
            });

            input.value = '';
            textarea.value = '';
            textarea.dataset.quote = '';
            textarea.dataset.quoteAuthor = '';
            const oldQuote = document.querySelector('.js-quote-block');
            if (oldQuote) oldQuote.remove();

            renderComments();
        } catch (e) {
            alert('Ошибка при отправке: ' + e.message);
        }
    });
}