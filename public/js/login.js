
function login(event) {
	event.preventDefault();
	const inputName = document.getElementById('login-name').value;
	const inputPassword = document.getElementById('login-password').value;

	if (inputPassword != JSON.parse(localStorage.getItem('users'))[inputName]) {
		//console.log(inputName, JSON.parse(localStorage.getItem('users'))[inputName]);	
		document.getElementById('login-message').innerHTML = 'Invalid password';
	}
	if (!JSON.parse(localStorage.getItem('users'))[inputName]) {
		document.getElementById('login-message').innerHTML = 'Invalid name';
	}
	const users = JSON.parse(localStorage.getItem('users'));
	if (users[inputName] == inputPassword) {
		localStorage.setItem('user', inputName);
		window.location.href = 'app.html';
	}
}
