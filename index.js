import { getComments } from './modules/commentsApi.js';
import { renderComments } from './modules/renderComments.js';
import { attachAddCommentHandler } from './modules/attachHandlers.js';

export let comments = [];

function loadComments() {
    const list = document.querySelector('.comments');
    const listLoader = document.querySelector('.list-loader');

    listLoader.hidden = false;
    list.innerHTML = '';

    return getComments()
        .then((data) => {
            comments = data.map((c) => ({
                ...c,
                name: c.author.name,
                date: new Date(c.date).toLocaleString(),
                quote: '',
                quoteAuthor: '',
                likesCount: c.likes ?? 0,
                isLiked: false,
            }));
        })
        .then(() => { renderComments(); })
        .catch((err) => {
            if (err.code === 'offline') {
                alert('Кажется, у вас сломался интернет, попробуйте позже');
            } else if (err.code === 'server') {
                alert('Сервер сломался, попробуй позже');
            } else {
                alert('Не удалось загрузить комментарии');
            }
            console.error('Ошибка загрузки комментариев:', err);
        })
        .finally(() => { listLoader.hidden = true; });
}

attachAddCommentHandler();
void loadComments();
