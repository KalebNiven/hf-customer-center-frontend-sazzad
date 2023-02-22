$(document).ready(function () {

    var changeEmailForm = {
      rules: {
        email: {
          required: true,
          email: true,
        },
        email_confirmation: {
          required: true,
          email: true,
          equalTo: '#email'
        }
      },
      messages: {
        email: {
          required: 'Please enter a valid email address.'
        },
        email_confirmation: {
          required: 'Enter e-mail address confirmation.',
          equalTo: 'E-mails do not match.'
        }
      },
      errorClass: 'is-invalid',
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
        $('#changeEmailSubmitBtn').prop('disabled', true);
        $('#changeEmailSubmitBtn').removeClass('btn-primary');
        $('#changeEmailSubmitBtn').addClass('btn-inactive');
      },
      unhighlight: function(element, errorClass) {
        $(element).removeClass(errorClass);
        $(element).removeClass(element.id + '-icon-error');
        $(element).addClass(element.id + '-icon');
  
        if ($(element).attr('id') == 'password') {
          $('.passwordTooltipText').css('visibility', 'hidden');
        }
        $('#changeEmailSubmitBtn').prop('disabled', false);
        $('#changeEmailSubmitBtn').removeClass('btn-inactive');
        $('#changeEmailSubmitBtn').addClass('btn-primary');
      }
    };


    $('#editEmailModal').on('show.bs.modal', function () {
      // initialize the plugin
      validator = $('#changeEmailForm').validate(changeEmailForm);

      $('input[name=email]').val('');
      $('input[name=email]').removeClass('is-invalid');
      $('input[name=email]').removeClass('email-icon-error');
      $('input[name=email]').addClass('email-icon');
  
      $('input[name=email_confirmation]').val('');
      $('input[name=email_confirmation]').removeClass('is-invalid');
      $('input[name=email_confirmation]').removeClass('email_confirmation-icon-error');
      $('input[name=email_confirmation]').addClass('email_confirmation-icon');
  
      $('#changeEmailSubmitBtn').prop('disabled', true);
      $('#changeEmailSubmitBtn').removeClass('btn-primary');
      $('#changeEmailSubmitBtn').addClass('btn-inactive');
    });


    $('#editEmailModal').on('hidden.bs.modal', function (e) {
      validator.destroy();
      $('#email-error').css('display', '');
      $('#email_confirmation-error').css('display', '');
    })
    
});