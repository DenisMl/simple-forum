function http(url, type, data, cb) {
  $.ajax({
      url,
      dataType: 'json',
      type,
      data,
      success: cb,
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
}

function renderGallery(images) {
  document.getElementById('images').innerHTML = '';
  images.sort((a, b) => a.date < b.date).forEach(function(item) {
    const imageContainer = document.createElement('div');
		const image = document.createElement('img');
    image.setAttribute('src', item.url);
    image.setAttribute('image-id', item._id);
    image.setAttribute('data-toggle', 'modal');
    image.setAttribute('data-target', '#myModal');
    image.addEventListener('click', openImage);
    imageContainer.className = 'col-lg-3 col-md-3 col-sm-4 col-xs-6 image-preview';
    imageContainer.appendChild(image);
		document.getElementById('images').appendChild(imageContainer);
  });
}

function addPicture(event) {
	event.preventDefault();
  const url = event.target['input-pic-url'].value;
  const title = event.target['input-pic-title'].value;
  const validateUrl = url.replace(/(^\s+|\s+$)/g,'') === '';
  const validateTitle = title.replace(/(^\s+|\s+$)/g,'') === '';
  if ( validateUrl || validateTitle) {
    event.target['input-pic-url'].className = validateUrl ? 'col-xs-4 error' : 'col-xs-4';
    event.target['input-pic-title'].className = validateTitle ? 'col-xs-4 error' : 'col-xs-4';
  } else {
    http('/api/image', 'POST', { url, title }, loadPictures);
    event.target['input-pic-url'].value = '';
    event.target['input-pic-title'].value = '';
    document.getElementById('add-PopUp').click();
    event.target['input-pic-url'].className = 'col-xs-4';
    event.target['input-pic-title'].className = 'col-xs-4';
  }
}

function renderComments({ comments }) {
  const commentContainer = document.getElementById('comments');
  commentContainer.innerHTML = '';
  comments.forEach(function(item) {
    const comment = document.createElement('div');
    const author = document.createElement('span');
    const date = document.createElement('span');
    const text = document.createElement('span');
    author.setAttribute('id', 'comment-author');
    date.setAttribute('id', 'comment-date');
    text.setAttribute('id', 'comment-text');
    author.innerHTML = [item.author.nick];
    date.innerHTML = (moment(item.date).fromNow(true));
    text.innerHTML = (item.text);
    comment.appendChild(author);
    comment.appendChild(date);
    comment.appendChild(text);
    comment.appendChild(document.createElement('div'));
    commentContainer.appendChild(comment);
  });
  commentContainer.scrollTop = commentContainer.scrollHeight;
}

function renderLikes({ likes }) {
  document.getElementById('picture-likes').innerHTML = '';
  const likesCount = document.createTextNode(likes.length + ' likes');
  const likeBtn = document.getElementById('like');
  let liked = false;
  document.getElementById('picture-likes').appendChild(likesCount);
  http('/api/user', 'GET', null, (user) => {
    likes.forEach(item => {
      if (item._id === user.id) {
        liked = true;
      }
    });
    if (liked) {
      likeBtn.className += ' liked';
    } else {
      likeBtn.className = 'fa fa-heart';
    }
  });
}

function renderImage(data) {
  document.getElementById('image-container').innerHTML = '';
  //document.getElementById('myModalLabel').innerHTML = '';
  document.getElementById('picture-author').innerHTML = '';
  document.getElementById('picture-date').innerHTML = '';
  const image = document.createElement('img');
  const title = document.createTextNode(data.title);
  const author = document.createTextNode(data.author.nick);
  const date = document.createTextNode(moment(data.date).fromNow(true));
  image.setAttribute('src', data.url);
  image.setAttribute('id', 'selected-picture');
  image.setAttribute('image-id', data._id);
  document.getElementById('image-container').appendChild(image);
  //document.getElementById('myModalLabel').appendChild(title);
  document.getElementById('picture-author').appendChild(author);
  document.getElementById('picture-date').appendChild(date);
  renderComments({ comments: data.comments });
  renderLikes({ likes: data.likes });
};

function loadPictures() {
  http('/api/imageList', 'GET', null, renderGallery);
};

window.onload = loadPictures;

function openImage(e) {
  const id = e.srcElement.getAttribute('image-id');
  http(`/api/image?id=${id}`, 'GET', null, renderImage);
}

function callPopUp() {
  document.getElementById('input-pic-title').innerHTML = '';
  document.getElementById('input-pic-url').innerHTML = '';
}

function removeAllImages() {
  http(`/api/imageList`, 'DELETE', null, loadPictures);
}

function addComment(event) {
  event.preventDefault();
  const comment = event.target['input-comment'].value;
  const id = document.getElementById('selected-picture').getAttribute('image-id');
  const invalidComment = comment.replace(/(^\s+|\s+$)/g,'') === '';
  if (!invalidComment) {
    http('/api/comment', 'POST', { comment, id }, renderComments);
    event.target['input-comment'].value = '';
  }
}

function like() {
  const id = document.getElementById('selected-picture').getAttribute('image-id');
  http('/api/likes', 'POST', { imageId: id }, renderLikes);
}
