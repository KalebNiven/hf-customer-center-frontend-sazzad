/* 
Activate/deactive submit button based on form inputs
Toggles form input error classes
*/
$('#memberId, #lastName, #DOBFULL, #zipCode').on('keyup keypress change', function() {
    var memberId = $('input[name=memberId]').val(),
        lastName = $('input[name=lastName]').val(),
        DOBFULL = $('input[name=DOBFULL]').val(),
        zipCode = $('input[name=zipCode]').val();
    
    $('input[name=memberId]').removeClass('is-invalid');
    $('input[name=lastName]').removeClass('is-invalid');
    $('input[name=DOBFULL]').removeClass('is-invalid');
    $('input[name=zipCode]').removeClass('is-invalid');

    // hide form validation messages
    $('.error').addClass('hidden');

    if (memberId.length > 0 
        && lastName.length > 0 
        && DOBFULL.length > 0 
        && zipCode.length > 0
    ) {
        $('#attach-membership-submit').prop('disabled', false);
        $('#attach-membership-submit').removeClass('btn-inactive');
        $('#attach-membership-submit').addClass('btn-primary');
    } else {
        $('#attach-membership-submit').prop('disabled', true);
        $('#attach-membership-submit').removeClass('btn-primary');
        $('#attach-membership-submit').addClass('btn-inactive');
    }
});

