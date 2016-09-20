
function loadComments(e, comments = JSON.parse(localStorage.getItem('comments'))) {
	if (comments) {
		comments.forEach(function(item) {
			const color = JSON.parse(localStorage.getItem('color'))[item.name];
			const comment = document.createElement('div');
			comment.style.backgroundColor = color;
			document.getElementById('change-color-button').value = color;
			const name = document.createElement('p');
			const text = document.createElement('p');
			const date = document.createElement('p');			
			comment.className += "comment";
			name.className += "name";
			text.className += "text";
			date.className += "date";
			name.appendChild(document.createTextNode(item.name));
			text.appendChild(document.createTextNode(item.text));
			date.appendChild(document.createTextNode(moment(new Date(item.date)).format('MMM D YYYY, HH:mm:ss')));
			comment.appendChild(name);
			comment.appendChild(date);
			comment.appendChild(text);			
			document.getElementById('comments').appendChild(comment);
		});
	};
};

window.onload = loadComments;

function sendComment(event) {
	event.preventDefault();
	if (event.target['user-input'].value) {
		if (!localStorage.getItem('comments')) {
			localStorage.setItem('comments', JSON.stringify([]));
		}
		const comments = JSON.parse(localStorage.getItem('comments'));
		const name = localStorage.getItem('user');
		const text = event.target['user-input'].value;
		const date = new Date();
		comments.push({
			name,  // name: name
			text,
			date,
		});
		localStorage.setItem('comments', JSON.stringify(comments));
		loadComments(null, [comments.pop()]);
		event.target['user-input'].value = '';
		window.scrollTo(0, document.body.scrollHeight);
	}
};

function clearComments() {
	localStorage.removeItem('comments');
	location.reload();
};

function changeColor() {
	const color = document.getElementById('change-color-button').value;
	const name = localStorage.getItem('user');
	const colorObj = JSON.parse(localStorage.getItem('color'));
	colorObj[name] = color;
	localStorage.setItem('color', JSON.stringify(colorObj));
	location.reload();
};

//TODO: 

/*arr = [
	{
		name: 'Den',
		password: '1234',
	},
	{
		name: 'Dima',
		password: '5678',
	},
]

const name = input.value;
const user = arr.find(function(item) {
	return item.name === name;
})


function find(func, item) {
	if (func()) return item;
}*/