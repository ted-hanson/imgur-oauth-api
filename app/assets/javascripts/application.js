// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require turbolinks
//= require_tree .

function stopEvent(e) {
  e = e || event;
  e.preventDefault();  
  e.stopPropagation(); 
}

function submitForm(form) {
  $.ajax({
    type: "POST",
    url: form.attr("action"),
    data: form.serialize(),
    success: function(data) { alert('submit success!') }
  });
}

function saveImage(file) {
  var url = 'https://imgur.com/' + file;
  
  // add live image to page
  $('#images').append('<img class="remove_imgur_url" src="'+url+'" />'); 
  // submit new image to images
  var form = $('.new_image');
  form[0].image_url.value = url;
  submitForm(form);
}

function uploadToImgur(data, ext) {
  // send ajax to imgur for anonymous upload with our client-id
  $.ajax({ 
    url: 'https://api.imgur.com/3/image',
    headers: {
      Authorization: 'Client-ID 691995a204c4537',
      Accept: 'application/json'
    },
    type: 'POST',
    data: {
      // btoa makes binary data from FileReader into base64
      image: btoa(data),
      type: 'base64'
    },
    // save image in our database if it suceeds
    success: function(r) { saveImage(r.data.id + '.' + ext) },  
  }); 
}

function readFileThenUpload(f) {
  // create FileReader to grab image data
  reader = new FileReader();
  // callback for when the FileReader has finished
  reader.onloadend = function(e) {
    //post image to imgur 
    uploadToImgur(e.target.result, f.name.split(/\./).slice(-1)[0]);
  };    
  // read file
  reader.readAsBinaryString(f);
}

$(document).ready(function() {
  $('#file_drag').on('dragover', stopEvent);
  $('#file_drag').on('dragenter', stopEvent);
  $('#file_drag').on('drop', function(e) {
    stopEvent(e);
    files = e.originalEvent.dataTransfer.files;
    for (var i = 0; i < files.length; ++i) {
      readFileThenUpload(files[i]);
    }
  });
  $('#file_drag').on('click', function() {
    $('#file_input').click();
  });
  $('#file_input').on('change', function(e) {
    readFileThenUpload(e.target.files[0]);
  });
});
