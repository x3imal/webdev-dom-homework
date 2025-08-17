const COMMENTS_API = "https://wedev-api.sky.pro/api/v2/alex-kaz/comments";
const AUTH_API = "https://wedev-api.sky.pro/api/user/login";
const REGISTER_API = "https://wedev-api.sky.pro/api/user";

function toNetError(err) {
    if(!navigator.onLine || err.name === "TypeError")  {
        const e = new Error("offline");
        e.code = "offline"
        return e;
    }
    return err;
}

export function loginUser({ login, password }) {
    return fetch(`${AUTH_API}`, {
        method: "POST",
        body: JSON.stringify({ login, password }),
    })
        .then(async (res) => {
            if (res.status === 400 || res.status === 401) {
                const data = await res.json().catch(() => ({}));
                const e = new Error(data?.error || "Неверный логин или пароль");
                e.code = "bad_request";
                throw e;
            }
            if (!res.ok) throw new Error("Ошибка авторизации");
            return res.json();
        })
        .catch((err) => { throw toNetError(err); });
}

export function registerUser({ login, name, password }) {
    return fetch(`${REGISTER_API}`, {
        method: "POST",
        body: JSON.stringify({ login, name, password }),
    })
        .then(async (res) => {
            if (res.status === 400) {
                const data = await res.json().catch(() => ({}));
                const e = new Error(data?.error || "Некорректные данные");
                e.code = "bad_request";
                throw e;
            }
            if (!res.ok) throw new Error("Ошибка регистрации");
            return res.json();
        })
        .catch((err) => { throw toNetError(err); });
}

export function getComments() {
    return fetch(COMMENTS_API)
        .then((res) => {
            if (res.status >= 500) { const e = new Error("server"); e.code = "server"; throw e; }
            if (!res.ok) throw new Error("Ошибка загрузки комментариев");
            return res.json();
        })
        .then((data) => data.comments)
        .catch((err) => { throw toNetError(err); });
}

export function postComment({ text, token, forceError = false }) {
    return fetch(COMMENTS_API, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }, // без Content-Type
        body: JSON.stringify({ text, ...(forceError ? { forceError: true } : {}) }),
    })
        .then(async (res) => {
            if (res.status === 400) {
                const data = await res.json().catch(() => ({}));
                const e = new Error(data?.error || "Некорректные данные");
                e.code = "bad_request"; throw e;
            }
            if (res.status === 401 || res.status === 403) {
                const e = new Error("Требуется авторизация"); e.code = "unauthorized"; throw e;
            }
            if (res.status >= 500) { const e = new Error("server"); e.code = "server"; throw e; }
            if (!res.ok) throw new Error("Ошибка отправки комментария");
            return res.json();
        })
        .catch((err) => { throw toNetError(err); });
}