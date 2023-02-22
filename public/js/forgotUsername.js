/* 
Activate/deactive submit button based on form inputs
Toggles form input error classes
*/
$('#email, #DOB').on('keyup keypress blur change', function() {
    var email = $('input[name=email]').val(),
        dob = $('input[name=DOB]').val();

    $('input[name=email]').removeClass('is-invalid');
    $('input[name=email]').removeClass('email-icon-error');
    $('input[name=email]').addClass('email-icon');

    $('input[name=DOB]').removeClass('is-invalid');
    $('input[name=DOB]').removeClass('calendar-icon-error');
    $('input[name=DOB]').addClass('calendar-icon');

    // hide form validation messages
    $('.error').addClass('hidden');

    if (email.length > 0 && dob.length > 0) {
        $('#forgot-username-next').prop('disabled', false);
        $('#forgot-username-next').removeClass('btn-inactive');
        $('#forgot-username-next').addClass('btn-primary');
    } else {
        $('#forgot-username-next').prop('disabled', true);
        $('#forgot-username-next').removeClass('btn-primary');
        $('#forgot-username-next').addClass('btn-inactive');
    }
});


$('#closeErrorAlert').click(function() {
    $('#errorAlert').slideUp(500);
});