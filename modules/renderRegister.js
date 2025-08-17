export function renderRegisterForm({ onRegister, onGoToLogin }) {
    document.getElementById('app').innerHTML = `
    <div class="register-container">
      <h2>Регистрация</h2>
      <input type="text" class="register-name" placeholder="Имя" />
      <input type="text" class="register-login" placeholder="Логин" />
      <input type="password" class="register-password" placeholder="Пароль" />
      <button class="register-button">Зарегистрироваться</button>
      <p>Уже есть аккаунт? <a href="#" class="go-login">Войти</a></p>
    </div>
  `;

    document.querySelector('.register-button').addEventListener('click', () => {
        const name = document.querySelector('.register-name').value;
        const login = document.querySelector('.register-login').value;
        const password = document.querySelector('.register-password').value;
        onRegister({ name, login, password });
    });

    document.querySelector('.go-login').addEventListener('click', (e) => {
        e.preventDefault();
        onGoToLogin();
    });
}
