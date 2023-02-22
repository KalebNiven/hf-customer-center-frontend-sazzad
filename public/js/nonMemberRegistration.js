/*
Activate/deactive submit button based on form inputs
Toggles form input error classes
*/
$('#firstName, #DOB, #mobile, #email, #email_confirmation, #agreement').on('keyup keypress blur change', function() {
    var firstName = $('input[name=firstName]').val(),
        DOB = $('input[name=DOB]').val(),
        email = $('input[name=email]').val(),
        phone = $('input[name=mobile]').val(),
        emailConfirmation = $('input[name=email_confirmation]').val(),
        agreement = $('input[name=agreement]').prop('checked') ? 1 : 0;

    $('input[name=firstName]').removeClass('is-invalid');
    $('input[name=DOB]').removeClass('is-invalid');
    $('input[name=mobile]').removeClass('is-invalid');
    $('input[name=email]').removeClass('is-invalid');
    $('input[name=email_confirmation]').removeClass('is-invalid');

    // hide form validation messages
    $('.error').addClass('hidden');

    if (firstName.length > 0
        && DOB.length > 0
        && email.length > 0
        && emailConfirmation.length > 0
        && agreement == 1
    ) {
        $('#register-create-account').prop('disabled', false);
        $('#register-create-account').removeClass('btn-inactive');
        $('#register-create-account').addClass('btn-primary');
    } else {
        $('#register-create-account').prop('disabled', true);
        $('#register-create-account').removeClass('btn-primary');
        $('#register-create-account').addClass('btn-inactive');
    }

    var data = JSON.parse($('#register-create-account').attr('segment-props'));
    data.primary_email = email;
    data.primary_phone = phone;
    $('#register-create-account').attr('segment-props', JSON.stringify(data));
});

$(document).ready(function() {
    var firstName = $('input[name=firstName]').val(),
        DOB = $('input[name=DOB]').val(),
        email = $('input[name=email]').val(),
        emailConfirmation = $('input[name=email_confirmation]').val(),
        agreement = $('input[name=agreement]').prop('checked') ? 1 : 0;

    if (firstName.length > 0
        && DOB.length > 0
        && email.length > 0
        && emailConfirmation.length > 0
        && agreement == 1
    ) {
        $('#register-create-account').prop('disabled', false);
        $('#register-create-account').removeClass('btn-inactive');
        $('#register-create-account').addClass('btn-primary');
    }
});

$('#closeErrorAlert').click(function() {
    $('#errorAlert').slideUp(500);
});

$('#registerForm').submit(function(e) {
    // prevent user from changing state of any checkboxes
    $('#registerForm').delegate('[type="checkbox"][readonly="readonly"]', 'click', function(ev) {
        ev.preventDefault();
    });

    // make all form input elements read only
    $('#registerForm :input').attr('readonly', 'readonly');
    // remove all event handlers from the form input elements
    $('#registerForm :input').off();
    $('#register-create-account').prop('disabled', true);
});
