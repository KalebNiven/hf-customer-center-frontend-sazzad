/* 
Activate/deactive submit button based on form inputs
Toggles form input error classes
*/
$('#username, #DOB').on('keyup keypress blur change', function() {
    var username = $('input[name=username]').val(),
        dob = $('input[name=DOB]').val();

    $('input[name=username]').removeClass('is-invalid');
    $('input[name=username]').removeClass('username-icon-error');
    $('input[name=username]').addClass('username-icon');

    $('input[name=DOB]').removeClass('is-invalid');
    $('input[name=DOB]').removeClass('calendar-icon-error');
    $('input[name=DOB]').addClass('calendar-icon');

    // hide form validation messages
    $('.error').addClass('hidden');

    if (username.length > 0 && dob.length > 0) {
        $('#forgot-password-next').prop('disabled', false);
        $('#forgot-password-next').removeClass('btn-inactive');
        $('#forgot-password-next').addClass('btn-primary');
    } else {
        $('#forgot-password-next').prop('disabled', true);
        $('#forgot-password-next').removeClass('btn-primary');
        $('#forgot-password-next').addClass('btn-inactive');
    }
});


$('#closeErrorAlert').click(function() {
    $('#errorAlert').slideUp(500);
});