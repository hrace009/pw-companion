var serveraddr = "http://upw.gtwenty.com"; //Адрес сервера в формате http://example.com:8888, закрывающий слэш НЕ НУЖЕН!

function toggleFullScreenModal(element){
  $(element).slideToggle();
}
//Check if email is valid
function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}
//Check if user is logged in
function init(){
  if (window.localStorage.getItem("islogged") !== "true"){
    $('#header').css('display', 'none');
    $('#content').load('templates/android/login/login.html');
    $('select').material_select();
  } else {
    $(".button-collapse").sideNav({closeOnClick: true});
    var data = JSON.stringify({'id': localStorage.getItem("uid")});
    $.ajax({
    method: "POST",
    dataType: "JSON",
    crossDomain: true,
    url: serveraddr+"/account/getAccountData",
    data: data
  }).done(function(msg){
    $('#user-nickname').text(msg.nickname);
    $('#user-login').text(msg.login);
  });
  }
}
//Handle the login form
function login(){
  var login = $('#login-login').val();
  var pass = $('#login-pass').val();
  var data = JSON.stringify({'login': login, 'password': pass});
  $.ajax({
  method: "POST",
  dataType: "JSON",
  crossDomain: true,
  url: "http://localhost:8888/auth/auth",
  data: data
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
function logout(){
  window.localStorage.clear();
  location.href = "index-and.html";
}
$('#login-email').change(function(){
  $('#login-result').html('');
});
$('#login-pass').change(function(){
  $('#login-result').html('');
});


//Грузим регистрацию
function registerStepOne(){
  $('#header').css('display', 'none');
  $('#content').load('templates/android/register/stepone.html');
  if(localStorage.getItem("register-email")){
    $('#register-email').attr('value', localStorage.getItem("register-email"));
  }
  if(localStorage.getItem("register-pass")){
    $('#register-pass').val(localStorage.getItem("register-pass"));
    $('#register-repass').val(localStorage.getItem("register-pass"));
  }
}
//Проверяем 1й шаг
function registerStepTwo(){
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