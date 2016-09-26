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
  images.forEach(function(item) {
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
};

function browsePicture(event) {
	event.preventDefault();
  const url = event.target['pic-url'].value;
  http('/api/image', 'POST', { url }, loadPictures);
  event.target['pic-url'].value = '';
};

function renderImage(data) {
  document.getElementById('modal-body').innerHTML = '';
  document.getElementById('myModalLabel').innerHTML = '';
  const imageContainer = document.createElement('div');
  const image = document.createElement('img');
  const title = document.createTextNode(data.title);
  imageContainer.className = 'image-container';
  image.setAttribute('src', data.url);
  imageContainer.appendChild(image);
  document.getElementById('modal-body').appendChild(imageContainer);
  document.getElementById('myModalLabel').appendChild(title);
};

function loadPictures() {
  http('/api/imageList', 'GET', null, renderGallery);
};

window.onload = loadPictures;

function openImage(e) {
  const id = e.srcElement.getAttribute('image-id');
  http(`/api/image?id=${id}`, 'GET', null, renderImage);
}
