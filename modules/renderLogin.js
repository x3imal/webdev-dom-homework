export function renderLoginForm({ onLogin, onGoToRegister }) {
    document.getElementById('app').innerHTML = `
    <div class="login-container">
      <h2>Вход</h2>
      <input type="text" class="login-name" placeholder="Имя пользователя" />
      <input type="password" class="login-password" placeholder="Пароль" />
      <button class="login-button">Войти</button>
      <p>Нет аккаунта? <a href="#" class="go-register">Зарегистрироваться</a></p>
    </div>
  `;

    document.querySelector('.login-button').addEventListener('click', () => {
        const login = document.querySelector('.login-name').value;
        const password = document.querySelector('.login-password').value;
        onLogin({ login, password });
    });

    document.querySelector('.go-register').addEventListener('click', (e) => {
        e.preventDefault();
        onGoToRegister();
    });
}

