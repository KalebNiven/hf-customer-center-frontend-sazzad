$.validator.addMethod('passwordCheck', function(value) {
  return /^[a-zA-Z0-9!@#$%\^&*)(+=._-]*$/.test(value) // consists of only these
    && /[A-Z]/.test(value) // has a uppercase letter
    && /[a-z]/.test(value) // has a lowercase letter
    && /\d/.test(value)    // has a digit
    && /[!@#$%^&*]/.test(value)   // has an allowed special character
});

$(document).ready(function () {

  var changePasswordForm = {
    rules: {
      oldPassword: {
        required: true,
        minlength: 6,
      },
      password: {
        required: true,
        minlength: 9,
        passwordCheck: true
      },
      password_confirmation: {
        equalTo: '#password',
        required: true
      }
    },
    messages: {
      oldPassword: {
        required: 'Please enter current password.'
      },
      password: {
        required: 'Please enter a valid new password.',
        passwordCheck: 'Password requirements were not met.'
      },
      password_confirmation: {
        equalTo: 'Passwords do not match.',
        required: 'Enter password confirmation'
      }
    },
    errorClass: 'is-invalid',
    onkeyup: false,
    errorPlacement: function(error, element) {
      element.siblings('.error').html(error).show();
    },
    highlight: function(element, errorClass) {
      $(element).removeClass(element.id + '-icon');
      $(element).addClass(element.id + '-icon-error');
      $(element).addClass(errorClass);

      if ($(element).attr('id') == 'password') {
        $('.passwordTooltipText').css('visibility', 'visible');
      }

      $('#changePasswordSubmitBtn').prop('disabled', true);
      $('#changePasswordSubmitBtn').removeClass('btn-primary');
      $('#changePasswordSubmitBtn').addClass('btn-inactive');
    },
    unhighlight: function(element, errorClass) {
      $(element).removeClass(errorClass);
      $(element).removeClass(element.id + '-icon-error');
      $(element).addClass(element.id + '-icon');

      // hide any server side error messages
      $('.dismissable-error').hide();

      if ($(element).attr('id') == 'password') {
        $('.passwordTooltipText').css('visibility', 'hidden');
      }

      $('#changePasswordSubmitBtn').prop('disabled', false);
      $('#changePasswordSubmitBtn').removeClass('btn-inactive');
      $('#changePasswordSubmitBtn').addClass('btn-primary');
    },
  };

  
  $('input[name=password_confirmation]').on('focus', function() {
    if(!$(this).val()) {
      $(this).removeClass('is-invalid');
      $(this).removeClass('password_confirmation-icon-error');
      $(this).addClass('password_confirmation-icon');
      $(this).siblings('.error').html('').hide();
    }
  });

  $('input[name=password]').on({
    keyup: function(e) {
      var input = $(this).val();

      input = input.replace(/([^a-zA-Z0-9!@#$%\^&\*]$)/g,'');
      $("input[name='password']").val(input);

      var charCode = (e.which) ? e.which : e.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57) && (charCode < 36 || charCode > 40)) {
        return false;
      }
      return true;
    }
  });

  $('.passwordTooltip').hover(function() {
    $('.passwordTooltipText').css('visibility', 'visible');
  }, function() {
    $('.passwordTooltipText').css('visibility', 'hidden');
  });
 
  /* 
  Activate/deactive submit button based on form inputs
  Toggles form input error classes
  */
  $('#password, #password_confirmation').on('change', function() {
    $('#changePasswordForm').valid();
  });

  $('#editPasswordModal').on('show.bs.modal', function () {
    // initialize the plugin
    validator = $('#changePasswordForm').validate(changePasswordForm);

    $('input[name=oldPassword]').val('');
    $('input[name=oldPassword]').removeClass('is-invalid');
    $('input[name=oldPassword]').removeClass('oldPassword-icon-error');
    $('input[name=oldPassword]').addClass('oldPassword-icon');

    $('input[name=password]').val('');
    $('input[name=password]').removeClass('is-invalid');
    $('input[name=password]').removeClass('password-icon-error');
    $('input[name=password]').addClass('password-icon');

    $('input[name=password_confirmation]').val('');
    $('input[name=password_confirmation]').removeClass('is-invalid');
    $('input[name=password_confirmation]').removeClass('password_confirmation-icon-error');
    $('input[name=password_confirmation]').addClass('password_confirmation-icon');

    $('#changePasswordSubmitBtn').prop('disabled', true);
    $('#changePasswordSubmitBtn').removeClass('btn-primary');
    $('#changePasswordSubmitBtn').addClass('btn-inactive');
  });

  $('#editPasswordModal').on('hidden.bs.modal', function (e) {
    validator.destroy();
    $('#password-error').css('display', '');
    $('#password_confirmation-error').css('display', '');
  })

});
