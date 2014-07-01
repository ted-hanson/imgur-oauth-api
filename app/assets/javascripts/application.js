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
  e.preventDefault();  
  e.stopPropagation(); 
}

function store(k, v) {
  localStorage.setItem(k, v);
}

function get(k) {
  return localStorage.getItem(k); 
}

function saveImage(id) {
  var url = 'https://imgur.com/' + id;
  $('#test_imgur_url').val(function (e, old) {
    return old + (old ? ', ' : '') + url;
  });
  $('#images').append('<img src="'+url+'" />'); 
}

$(document).ready(function() {
  $('#filedrag').on('dragover', stopEvent);
  $('#filedrag').on('dragenter', stopEvent);
  $('#filedrag').on('drop', function(e) {
    stopEvent(e);
    files = e.originalEvent.dataTransfer.files;
    for (var i = 0; i < files.length; ++i) {
      f = files[i];
      reader = new FileReader();
      reader.onloadend = function(e) {
        //only start if the file is done reading
        if (e.target.readyState === FileReader.DONE) {
          store('img', e.target.result);
          store('ext', f.name.split(/\./).slice(-1)[0]);  
        } else {
          throw Error('File Reader not done loading file!');
        }
       
        //post image to imgur 
        $.ajax({ 
          url: 'https://api.imgur.com/3/image',
          headers: {
            Authorization: 'Client-ID 691995a204c4537',
            Accept: 'application/json'
          },
          type: 'POST',
          data: {
            image: btoa(get('img')),
            type: 'base64'
          },
          success: function(r) { saveImage(r.data.id + '.' + get('ext')) },  
        }); 
      };    
  
      reader.readAsBinaryString(f);
    }
  });
});
