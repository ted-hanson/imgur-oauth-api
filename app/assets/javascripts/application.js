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

function putCookie(k, v) {
  document.cookie = k+'='+encodeURIComponent(v)+';';
}

function getCookie(c) {
  var x = document.cookie.split(c+'=');
  return (x.length > 1) ? decodeURIComponent(x[1].split(';')[0]) : null;
}

function auth() {
  var x = window.location.href.split('access_token=');
  return (x.length > 1) ? x[1].split('&')[0] : false;
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
          console.log(f.name.split(/\./).slice(-1)[0]);
          putCookie('ext', f.name.split(/\./).slice(-1)[0]);  
          putCookie('img', e.target.result);
        } else {
          return
        }

        //grab auth token from url
        token = auth();        
        
        //redirect to imgur if no auth token
        if (!token) {
          window.location = 'https://api.imgur.com/oauth2/authorize?client_id=691995a204c4537&response_type=token'; 
        } 
       
        //post image to imgur 
        $.ajax({ 
          url: 'https://api.imgur.com/3/image',
          headers: {
            Authorization: 'Bearer ' + token,
            Accept: 'application/json'
          },
          type: 'POST',
          data: {
            image: btoa(getCookie('img')),
            type: 'base64'
          },
          success: function(r) {
            var url = 'https://imgur.com/' + r.data.id + '.' + getCookie('ext');
            console.log('Image uploaded successfully to ' + url);
            $('#test_imgur_url').val(function (e, old) {
              return old + (old ? ', ' : '') + url;
            });
            $('#images').append('<img src="'+url+'" />'); 
          }
        });
         
      };    
  
      reader.readAsBinaryString(f);
    }
  });
});
