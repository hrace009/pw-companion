//Check if user is logged in
function init(){
  if (window.localStorage.getItem("islogged") !== "true"){
    $('#header').css('display', 'none');
    $('#content').load('templates/android/login/login.html');
  } else {
    $(".button-collapse").sideNav({closeOnClick: true});
    var data = JSON.stringify({'id': localStorage.getItem("uid")});
    $.ajax({
    method: "POST",
    dataType: "JSON",
    crossDomain: true,
    url: "http://localhost:8888/account/contactData",
    data: {'data': data},

  }).done(function(msg){
    
    if(msg.message.photo == ''){
      $('#sidenav-avatar').attr('src', '/img/default-avatar.jpg');
    } else {
        $('#sidenav-avatar').attr('src', msg.message.photo);
    }
    $('#user-name').text(msg.message.firstName+" "+msg.message.lastName);
    $('#user-position').text(msg.message.position);

  });
  }
}
//Open registration dialog
function openRegisterDialog(){
  $('#header').css('display', 'none');
  $('#content').load('templates/android/register/stepone.html');
  /*
  * ToDo: Сделать ловилку изменений формы, если поле пустое, то сделать disabled кнопку далее
  $('#register-form > div.input-field > input').keypress(function(){
    if($(this).val() == ''){
      $('#bottom-nav-row > a').removeClass('black-text');
      $('#bottom-nav-row > a').addClass('grey-text');
    }
  });
  */
  if(localStorage.getItem("register-email")){
    $('#register-email').attr('value', localStorage.getItem("register-email"));
    console.log($('#register-email').val());
  }
  if(localStorage.getItem("register-pass")){
    $('#register-pass').val(localStorage.getItem("register-pass"));
    $('#register-repass').val(localStorage.getItem("register-pass"));
    console.log($('#register-pass').val());
  }
}


//Handle the login form
function login(){
  var email = $('#login-email').val();
  var pass = $('#login-pass').val();
  var data = JSON.stringify({'email': email, 'password': pass});
  $.ajax({
  method: "POST",
  dataType: "JSON",
  crossDomain: true,
  url: "http://localhost:8888/auth/auth",
  data: {'data': data}
  }).done(function(msg){
    if(msg.message == 'Success'){
      window.localStorage.setItem("islogged", "true");
      window.localStorage.setItem("uid", msg.user_id);
      location.href="index-and.html";
    } else {
      $('#login-result').html(msg.message);
    }
  });
}


$('#login-email').change(function(){
  $('#login-result').html('');
});


$('#login-pass').change(function(){
  $('#login-result').html('');
});

//Check if email is valid
function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

//Check the first step of registration and proceed to step 2
function steptwo(){
  console.log('checking form');
  var email = $('#register-email').val();
  var pass = $('#register-pass').val();
  var repass = $('#register-repass').val();
  //Запихать проверку на существование email в базе
  var emailexists = false; //Пока так
  var check = true;
  if(email == '' || pass == '' || pass != repass || !validateEmail(email)){
    check = false;
  }
  if (emailexists == true){
    $('#register-result').html('You have an account here. Please proceed to <a href="index-and.html">login</a>. Or you <a href="#"  onclick="passforget();">forgot your password?</a>');
    console.log('account exists');
  } else {
    if(check == false){
      $('#register-result').html('Fill in the form correctly.');
    } else {
      window.localStorage.setItem("register-email", email);
      window.localStorage.setItem("register-pass", pass);
      $('#content').load('templates/android/register/steptwo.html');
    }
  }
  if(!validateEmail(email) || pass !== repass){
    //do nothing
  }
}



function passRecovery(){
  //ToDo: Написать функцию
}

function openNotificationsList(){
  init();
  $('#content').load('templates/android/notifications/notifications.html');
  $('select').material_select();
}

//opens notification add modal
function openNotificationsAdd(){
  $('#modal-add-notification').openModal();
  $('#upsert-btn-ok').click(function(){
    addNotification();
    openNotificationsList();
  });
  $('#noti-modal-header').text('New notification');
}

function openNotificationsEdit(id){
  $('#modal-add-notification').openModal();
  $('#upsert-btn-ok').click(function(){
    saveNotification(id);
    openNotificationsList();
  });
$('#noti-modal-header').text('Edit notification');
}
function addNotification(){
  //ToDo: Написать функцию
}
function saveNotification(id){
  //ToDo: И эту тоже
}
function openSettings(){
  $('#content').load('templates/android/settings/settings.html');
}
function logout(){
  window.localStorage.clear();
  location.href = "index-and.html";
}
function toggleFullScreenModal(element){
  $(element).slideToggle();
}
function toggleNotificationsAdd2(){
  toggleFullScreenModal('#test-modal');
}

function openeditprofile(){
  toggleFullScreenModal($('#editprofile-modal'));
  var data = JSON.stringify({'id': localStorage.getItem("uid")});
  $.ajax({
  method: "POST",
  dataType: "JSON",
  crossDomain: true,
  url: "http://localhost:8888/account/contactData",
  data: {'data': data},
  }).done(function(msg){
    $('#profile-fname').val(msg.message.firstName);
    $('#profile-mname').val(msg.message.middleName);
    $('#profile-lname').val(msg.message.lastName);
    $('#profile-position').val(msg.message.position);
    if(msg.message.photo != ""){
      $('#avatar-img').attr('src', msg.message.photo);
    } else {
      $('#avatar-img').attr('src', '/img/default-avatar.jpg');
    }
  });
}
function shownewimage(){
  $('#avatar-pic-upload').change();
}
$('#avatar-pic-upload').change(function(){
  $(this).base64img({
    url: e.target.files[0],
    result: '#hiddenphotodata'
  });
  $('#avatar-img').attr('src', $('#hiddenphotodata').val());
});
