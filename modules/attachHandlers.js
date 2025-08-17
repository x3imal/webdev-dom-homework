import {comments, auth, renderCommentsPage} from '../index.js'
import {renderComments} from './renderComments.js'
import {showQuoteBlock} from './showQuoteBlock.js'
import {postComment} from "./commentsApi.js";

const FORCE_500 = false; //сделаем для теста

export function attachLikeListeners() {
    document.querySelectorAll('.like-button').forEach((btn) => {
        btn.onclick = () => {
            const idx = btn.dataset.index;
            const c = comments[idx];
            c.isLiked = !c.isLiked;
            c.likesCount += c.isLiked ? 1 : -1;
            renderComments();
        };
    });
}

export function attachQuoteListeners() {
    const textarea = document.querySelector('.add-form-text');
    document.querySelectorAll('.comment').forEach((li) => {
        li.onclick = (e) => {
            if (e.target.classList.contains('like-button')) return;
            const idx = li.dataset.index;
            const c = comments[idx];
            textarea.dataset.quote = c.text;
            textarea.dataset.quoteAuthor = c.name;
            showQuoteBlock(c.text, c.name, textarea);
            textarea.focus();
        };
    });
}

export function attachAddCommentHandler() {
    const textarea = document.querySelector('.add-form-text');
    const button = document.querySelector('.add-form-button');
    const addForm = document.querySelector('.add-form');
    const addLoader = document.querySelector('.add-loader');
    if (!button) return;

    button.addEventListener('click', () => {
        if (!auth.token) {
            renderCommentsPage({forceLoginHint: true});
            return;
        }

        textarea.classList.remove('error');
        const text = (textarea?.value || '').trim();
        const quote = textarea?.dataset.quote || '';
        const quoteAuthor = textarea?.dataset.quoteAuthor || '';

        if (text.length < 3) {
            alert('Комментарий должен быть не короче 3 символов');
            textarea.classList.add('error');
            return;
        }

        addForm.hidden = true;
        addLoader.hidden = false;
        button.disabled = true;

        let ok = false;

        postComment({text, token: auth.token, forceError: FORCE_500})
            .then(() => {
                comments.push({
                    name: auth.name,
                    text,
                    quote,
                    quoteAuthor,
                    date: new Date().toLocaleString(),
                    likesCount: 0,
                    isLiked: false,
                });
                ok = true;
            })
            .then(() => {
                if (ok) {
                    if (textarea) {
                        textarea.value = '';
                        textarea.dataset.quote = '';
                        textarea.dataset.quoteAuthor = '';
                        document.querySelector('.js-quote-block')?.remove();
                    }
                }
                renderComments();
                addLoader.hidden = true;
            })
            .catch((e) => {
                if (e.code === 'offline') alert('Кажется, у вас сломался интернет, попробуйте позже');
                else if (e.code === 'server') alert('Сервер сломался, попробуй позже');
                else if (e.code === 'unauthorized') {
                    alert('Сессия истекла. Войдите снова.');
                    auth.token = null;
                    auth.name = '';
                    renderCommentsPage({forceLoginHint: true});
                } else if (e.code === 'bad_request') alert(e.message || 'Ошибка валидации');
                else alert('Ошибка при отправке: ' + e.message);
            })
            .finally(() => {
                addLoader.hidden = true;
                addForm.hidden = false;
                button.disabled = false;
            });
    });
}