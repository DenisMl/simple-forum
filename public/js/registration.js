function register(event) {
	event.preventDefault();
	const name = document.getElementById('reg-name').value;
	const password = document.getElementById('reg-password').value;
	const confPassword = document.getElementById('reg-password-confirm').value;	
	if (!localStorage.getItem('users')) {
		localStorage.setItem('users', JSON.stringify({}));
	}
	if (password != confPassword) {
		document.getElementById('reg-message').innerHTML = 'Passwords do not match';
	}
	else if (JSON.parse(localStorage.getItem('users'))[name]) {
		document.getElementById('reg-message').innerHTML = 'This name already exists';
	}
	else {
		const users = JSON.parse(localStorage.getItem('users'));
		users[name] = password;
		localStorage.setItem('users', JSON.stringify(users));
		if (!localStorage.getItem('color')) {
			localStorage.setItem('color', JSON.stringify({}));
		}
		const color = document.getElementById('reg-color').value;
		const colorObj = JSON.parse(localStorage.getItem('color'));
		colorObj[name] = color;
		localStorage.setItem('color', JSON.stringify(colorObj));
		window.location.href = 'login.html';
	}
	
}

//TODO: 