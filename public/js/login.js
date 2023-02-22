function toggleSubmitButton() {
    var usr = $('input[name=username]').val(),
        pw = $('input[name=password]').val();

    if (usr.length > 0 && pw.length > 0) {
        $('#login-sign-in').prop('disabled', false);
        $('#login-sign-in').removeClass('btn-inactive');
        $('#login-sign-in').addClass('btn-primary');
    } else {
        $('#login-sign-in').prop('disabled', true);
        $('#login-sign-in').removeClass('btn-primary');
        $('#login-sign-in').addClass('btn-inactive');
    }
}


function clearErrorState() {
    $('input[name=username]').removeClass('is-invalid');
    $('input[name=username]').removeClass('username-icon-error');
    $('input[name=username]').addClass('username-icon');

    $('input[name=password]').removeClass('is-invalid');
    $('input[name=password]').removeClass('password-icon-error');
    $('input[name=password]').addClass('password-icon');
    $('.error').html('');
}




$('#username, #password').on('keyup keypress blur change', function() {
    toggleSubmitButton();
    clearErrorState();
});

// Strip out invalid characters from username as the user types
$('input[name=username]').on({
    keyup: function(e) {
      var input = $(this).val();

      input = input.replace(/([^\w\._@])/g,'');
      $("input[name='username']").val(input);

      var charCode = (e.which) ? e.which : e.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57) && (charCode < 36 || charCode > 40)) {
        return false;
      }
      return true;
    }
});


$('#login-sign-in').on('click', function(e){
    e.preventDefault();

    var routes = $.parseJSON($('#login-sign-in').attr("route"));
    $.ajax({
        method: 'DELETE',
        url: routes.okta,
        headers: {
            'Accept': 'application/json'
        },
        xhrFields: {
            'withCredentials': true
        },
        success: function (response) {
        },
        error: function (error) {
        },
        complete: function () {
            $('#loginForm').submit();
        }
    });
});

$(document).ready(function() {
    toggleSubmitButton();

    if(navigator.cookieEnabled == false) {
        $('.cookie-msg').show();
    } else {
        $('.cookie-msg').hide();
    }
});
