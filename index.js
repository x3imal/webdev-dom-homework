import { getComments, loginUser, registerUser } from './modules/commentsApi.js';
import { renderComments } from './modules/renderComments.js';
import { attachAddCommentHandler } from './modules/attachHandlers.js';
import { renderLoginForm } from './modules/renderLogin.js';
import { renderRegisterForm } from './modules/renderRegister.js';

export let comments = [];
export let auth = {
    token: localStorage.getItem('token'),
    name: localStorage.getItem('name'),
};

function mainTemplate() {
    return `
    <div class="list-loader" hidden>Загружаю комментарии…</div>
    <ul class="comments"></ul>
    <div class="auth-hint" style="margin-top:12px;"></div>
    <div class="add-loader" hidden>Комментарий добавляется…</div>
    <div class="add-form" hidden>
        <input type="text" class="add-form-name" readonly />
        <textarea class="add-form-text" placeholder="Введите ваш комментарий" rows="4"></textarea>
        <div class="add-form-row" style="display: flex; gap: 12px;">
            <button type="button" class="add-form-button">Написать</button>
            <button type="button" class="logout-button">Выйти</button>
        </div>
    </div>
  `;
}

export function renderCommentsPage({ forceLoginHint = false } = {}) {
    const app = document.getElementById('app');
    app.innerHTML = mainTemplate();
    loadComments();
    updateAuthUI({ forceLoginHint });
}

function updateAuthUI({ forceLoginHint = false } = {}) {
    const hint = document.querySelector('.auth-hint');
    const addForm = document.querySelector('.add-form');
    const nameInput = document.querySelector('.add-form-name');
    const logoutBtn = document.querySelector('.logout-button');

    if (auth.token) {
        hint.innerHTML = '';
        addForm.hidden = false;
        nameInput.value = auth.name;
        nameInput.setAttribute('readonly', 'readonly');
        attachAddCommentHandler();

        logoutBtn?.addEventListener('click', () => {
            localStorage.removeItem('token');
            localStorage.removeItem('name');
            auth.token = null;
            auth.name = '';
            renderCommentsPage({ forceLoginHint: true });
        });
    } else {
        addForm.hidden = true;
        hint.innerHTML = `Чтобы добавить комментарий, <a href="#" class="go-login">авторизуйтесь</a>`;
        hint.querySelector('.go-login')?.addEventListener('click', (e) => {
            e.preventDefault();
            showLogin();
        });
    }
}

export function loadComments() {
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
        .then(() => {
            renderComments();
        })
        .catch((err) => {
            if (err.code === 'offline') alert('Кажется, у вас сломался интернет, попробуйте позже');
            else if (err.code === 'server') alert('Сервер сломался, попробуй позже');
            else alert('Не удалось загрузить комментарии');
            console.error('Ошибка загрузки комментариев:', err);
        })
        .finally(() => {
            listLoader.hidden = true;
        });
}

function showLogin() {
    renderLoginForm({
        onLogin: ({ login, password }) => {
            loginUser({ login, password })
                .then((data) => {
                    auth.token = data?.user?.token ?? data?.token ?? null;
                    auth.name = data?.user?.name ?? data?.name ?? login;

                    // сохраняем в localStorage
                    localStorage.setItem('token', auth.token);
                    localStorage.setItem('name', auth.name);

                    renderCommentsPage();
                })
                .catch((err) => {
                    if (err.code === 'offline') alert('Кажется, у вас сломался интернет');
                    else if (err.code === 'bad_request') alert(err.message || 'Неверные данные');
                    else alert('Ошибка авторизации: ' + err.message);
                });
        },
        onGoToRegister: () => showRegister(),
    });
}

function showRegister() {
    renderRegisterForm({
        onRegister: ({ name, login, password }) => {
            registerUser({ name, login, password })
                .then((data) => {
                    const token = data?.user?.token ?? data?.token ?? null;
                    const displayName = data?.user?.name ?? data?.name ?? name;

                    if (token) {
                        auth.token = token;
                        auth.name = displayName;
                        localStorage.setItem('token', token);
                        localStorage.setItem('name', displayName);
                        renderCommentsPage();
                    } else {
                        return loginUser({ login, password }).then((d) => {
                            auth.token = d?.user?.token ?? d?.token ?? null;
                            auth.name = d?.user?.name ?? d?.name ?? displayName;
                            localStorage.setItem('token', auth.token);
                            localStorage.setItem('name', auth.name);
                            renderCommentsPage();
                        });
                    }
                })
                .catch((err) => {
                    if (err.code === 'offline') alert('Проверьте подключение к интернету');
                    else if (err.code === 'bad_request') alert(err.message || 'Ошибка регистрации');
                    else alert('Ошибка: ' + err.message);
                });
        },
        onGoToLogin: () => showLogin(),
    });
}

// стартуем с попыткой восстановления
renderCommentsPage();
