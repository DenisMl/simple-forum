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
    const block = document.createElement('div');
    const imageContainer = document.createElement('div');
    const hover = document.createElement('div');
		const image = document.createElement('img');
    const likesCount = document.createElement('span');
    const commentsCount = document.createElement('span');
    const heartIcon = document.createElement('i');
    const commentIcon = document.createElement('i');
    image.setAttribute('src', item.url);
    hover.setAttribute('image-id', item._id);
    hover.setAttribute('data-toggle', 'modal');
    hover.setAttribute('data-target', '#myModal');
    hover.addEventListener('click', openImage);
    heartIcon.setAttribute('aria-hidden', 'true');
    commentIcon.setAttribute('aria-hidden', 'true');
    likesCount.innerHTML = item.likes.length;
    commentsCount.innerHTML = item.comments.length;
    block.className = 'col-lg-3 col-md-3 col-sm-4 col-xs-6 image-preview';
    imageContainer.className = 'previev-image-container';
    hover.className = 'previev-image-hover';
    likesCount.className = 'hover-info';
    commentsCount.className = 'hover-info';
    heartIcon.className = 'fa fa-heart';
    commentIcon.className = 'fa fa-comment';
    hover.appendChild(heartIcon);
    hover.appendChild(likesCount);
    hover.appendChild(commentIcon);
    hover.appendChild(commentsCount);
    imageContainer.appendChild(hover);
    imageContainer.appendChild(image);
    block.appendChild(imageContainer);
		document.getElementById('images').appendChild(block);
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
    http('/api/image', 'POST', { url, title }, () => loadPictures());
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
    author.innerHTML = item.author.nick;
    date.innerHTML = (moment(item.date).fromNow(true));
    text.innerHTML = item.text.replace(/#(\w+)/g, '<a onclick="loadPictures(`$1`, true); cancelTagSearch(`$1`);">$&</a>');
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
  document.getElementById('picture-author').appendChild(author);
  document.getElementById('picture-date').appendChild(date);
  renderComments({ comments: data.comments });
  renderLikes({ likes: data.likes });
};

function loadPictures(q, close) {
  if (close) {
    document.getElementById('myModal').click()
  }
  const tag = q || '';
  http(`/api/imageList?tag=${tag}`, 'GET', null, renderGallery);
};

loadPictures();

function openImage(e) {
  const id = e.srcElement.getAttribute('image-id');
  http(`/api/image?id=${id}`, 'GET', null, renderImage);
}

function callPopUp() {
  document.getElementById('input-pic-title').innerHTML = '';
  document.getElementById('input-pic-url').innerHTML = '';
}

function removeAllImages() {
  http(`/api/imageList`, 'DELETE', null, () => loadPictures());
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

function cancelTagSearch(tag) {
  if (tag === null) {
    loadPictures();
    document.getElementById('tags-search').style.visibility = 'hidden';
  }
  else {
    document.getElementById('tags-search-info').innerHTML = 'search by hashtag "' + tag + '"';
    document.getElementById('tags-search').style.visibility = 'visible';
  }
}

//todo: reloading of information on hovers (maybe global variable)
