$('#fpvc-resend-code-link').hide();
$('#fpvc-resend-code-link').delay(30000).show(0);


$('#verificationCode').on('keyup keypress blur change', function() {
    var verificationCode = $('input[name=verificationCode]').val();

    $('input[name=verificationCode]').removeClass('is-invalid');

    // hide form validation messages
    $('.error').addClass('hidden');

    if (verificationCode.length > 0) {
        $('#verify-code').prop('disabled', false);
        $('#verify-code').removeClass('btn-inactive');
        $('#verify-code').addClass('btn-primary');
    } else {
        $('#verify-code').prop('disabled', true);
        $('#verify-code').removeClass('btn-primary');
        $('#verify-code').addClass('btn-inactive');
    }
});


function resendVerifyCode()
{
    $('#MFAVerifyCodeForm').attr('action', '/MFAResendVerificationCode').submit();
}

function switchFactor()
{
    $('#MFAVerifyCodeForm').attr('action', '/MFAVerifyCodeSwitchFactor').submit();
}

function pad (str, max) {
    str = str.toString();
    return str.length < max ? pad("0" + str, max) : str;
}

// var x = setInterval(function() {
//
//     // Get today's date and time
//     var now = new Date().getTime();
//     now = Math.floor(now/ 1000);
//
//     // Find the distance between now and the count down date
//     var timeLeft = expiryTime - now;
//
//     var minutes = Math.floor((timeLeft / 60));
//     var seconds = Math.floor((timeLeft % 60));
//
//     // Output the result in an element with id="demo"
//     document.getElementById("timeLeft").innerHTML = minutes + ":" + pad(seconds, 2);
//
//     // If the count down is over, write some text
//     if (timeLeft < 0 && action == 'login') {
//         clearInterval(x);
//         window.location.href = "/sessionTimeout";
//     }else if(timeLeft < 0 && action != 'login'){
//         clearInterval(x);
//         document.getElementById("timeLeftDescriptor").innerHTML = "Your code has expired"
//         document.getElementById("timeLeft").innerHTML = ""
//     }
// }, 1000);
