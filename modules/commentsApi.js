const API_URL = "https://wedev-api.sky.pro/api/v1/alex-kaz/comments";

function toNetError(err) {
    if(!navigator.onLine || err.name === "TypeError")  {
        const e = new Error("offline");
        e.code = "offline"
        return e;
    }
    return err;
}

export function getComments() {
    return fetch(API_URL)
        .then((res) => {
            if (res.status >= 500) {
                const e = new Error("server");
                e.code = "server";
                throw e;
            }
            if (!res.ok) throw new Error("Ошибка загрузки комментариев");
            return res.json();
        })
        .then((data) => data.comments)
        .catch((err) => { throw toNetError(err); });
}

export function postComment({ text, name, forceError = false }) {
    return fetch(API_URL, {
        method: "POST",
        body: JSON.stringify({ text, name, ...(forceError ? { forceError: true } : {}) }),
    })
        .then(async (res) => {
            if (res.status === 400) {
                const data = await res.json();
                const e = new Error(data?.error || "Некорректные данные");
                e.code = "bad_request";
                throw e;
            }
            if (res.status >= 500) {
                const e = new Error("server");
                e.code = "server";
                throw e;
            }
            if (!res.ok) throw new Error("Ошибка отправки комментария");
            return res.json();
        })
        .catch((err) => { throw toNetError(err); });
}
