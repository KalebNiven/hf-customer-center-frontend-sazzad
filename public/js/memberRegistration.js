/*
Activate/deactive submit button based on form inputs
Toggles form input error classes
*/
$('#memberId, #firstName, #lastName, #DOBFULL, #zipCode, #mobile, #email, #email_confirmation, #agreement').on('keyup keypress blur change', function() {
    var memberId = $('input[name=memberId]').val(),
        firstName = $('input[name=firstName]').val(),
        lastName = $('input[name=lastName]').val(),
        DOBFULL = $('input[name=DOBFULL]').val(),
        zipCode = $('input[name=zipCode]').val(),
        phone = $('input[name=mobile]').val(),
        email = $('input[name=email]').val(),
        emailConfirmation = $('input[name=email_confirmation]').val(),
        agreement = $('input[name=agreement]').prop('checked') ? 1 : 0;

    $('input[name=memberId]').removeClass('is-invalid');
    $('input[name=firstName]').removeClass('is-invalid');
    $('input[name=lastName]').removeClass('is-invalid');
    $('input[name=DOBFULL]').removeClass('is-invalid');
    $('input[name=zipCode]').removeClass('is-invalid');
    $('input[name=mobile]').removeClass('is-invalid');
    $('input[name=email]').removeClass('is-invalid');
    $('input[name=email_confirmation]').removeClass('is-invalid');

    // hide form validation messages
    $('.error').addClass('hidden');

    if (memberId.length > 0
        && firstName.length > 0
        && lastName.length > 0
        && DOBFULL.length > 0
        && zipCode.length > 0
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
    var memberId = $('input[name=memberId]').val(),
        firstName = $('input[name=firstName]').val(),
        lastName = $('input[name=lastName]').val(),
        DOBFULL = $('input[name=DOBFULL]').val(),
        zipCode = $('input[name=zipCode]').val(),
        email = $('input[name=email]').val(),
        emailConfirmation = $('input[name=email_confirmation]').val(),
        agreement = $('input[name=agreement]').prop('checked') ? 1 : 0;

    if (memberId.length > 0
        && firstName.length > 0
        && lastName.length > 0
        && DOBFULL.length > 0
        && zipCode.length > 0
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
