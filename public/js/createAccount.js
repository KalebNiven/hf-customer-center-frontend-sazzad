$.validator.addMethod('usernameCheck', function(value) {
    return /^[\w\._@]+$/.test(value);
});

$.validator.addMethod('passwordCheck', function(value) {
    return /^[a-zA-Z0-9!@#$%\^&*)(+=._-]*$/.test(value) // consists of only these
    && /[A-Z]/.test(value) // has a uppercase letter
    && /[a-z]/.test(value) // has a lowercase letter
    && /\d/.test(value)    // has a digit
    && /[!@#$%^&*]/.test(value);   // has an allowed special character
});



// $(document).ready(function () {

var createAccountForm = {
    rules: {
    username: {
        required: true,
        minlength: 3,
        usernameCheck: true
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
        username: {
            required: 'Please enter a username.'
        },
        password: {
            required: 'Please enter a valid password.',
            passwordCheck: 'Password requirements were not met.'
        },
        password_confirmation: {
            equalTo: 'Passwords don\'t match. Please try again.',
            required: 'Enter password confirmation'
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
        $('#create-account').prop('disabled', true);
        $('#create-account').removeClass('btn-primary');
        $('#create-account').addClass('btn-inactive');
      },
      unhighlight: function(element, errorClass) {
        $(element).siblings('.error').hide();
        $(element).removeClass(errorClass);
        $(element).removeClass(element.id + '-icon-error');
        $(element).addClass(element.id + '-icon');
  
        if ($(element).attr('id') == 'password') {
          $('.passwordTooltipText').css('visibility', 'hidden');
        }
        $('#create-account').prop('disabled', false);
        $('#create-account').removeClass('btn-inactive');
        $('#create-account').addClass('btn-primary');
      }
};

// Initialize the plugin
$('#createAccountForm').validate(createAccountForm);

$('input[name=username]').on({
    keyup: function(e) {
    var input = $(this).val();

    input = input.replace(/([^\w\._@])/g,'');
    $("input[name='username']").val(input);
    //$(this).valid();

    var charCode = (e.which) ? e.which : e.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && (charCode < 36 || charCode > 40)) {
        return false;
    }
    return true;
    }
});


// Restrict characters usable for creating password.
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


// $('#username, #password, #password_confirmation').on('keyup keypress change', function() {
//     var username = $('input[name=username]').val(),
//         pw1 = $('input[name=password]').val(),
//         pw2 = $('input[name=password_confirmation]').val();


//     $('input[name=username]').removeClass('is-invalid');
//     $('input[name=password]').removeClass('is-invalid');
//     $('input[name=password_confirmation]').removeClass('is-invalid');

//     if (username.length > 0 && pw1.length > 0 && pw2.length > 0) {
//         $('#create-account').prop('disabled', false);
//         $('#create-account').removeClass('btn-inactive');
//         $('#create-account').addClass('btn-primary');
//     } else {
//         $('#create-account').prop('disabled', true);
//         $('#create-account').removeClass('btn-primary');
//         $('#create-account').addClass('btn-inactive');
//     }
// });


// var timerMinutes = 30,
//     timerSeconds = 0;

// if($("input[name='resumeTimer']").val() == 'y') {
//     var countDownDate = $("input[name='expTime']").val();
// } else {
//     var countDownDate = new Date().getTime() + (timerMinutes * 60 + timerSeconds) * 1000;
//     $("input[name='resumeTimer']").val('y');
//     $("input[name='expTime']").val(countDownDate);
// }

// // Function to execute every 1 second
// var t = setInterval(function() {

//     // Get todays datetime in microseconds
//     var now = new Date().getTime();

//     // Get delta between now and the countdown date
//     var distance = countDownDate - now;

//     // Time calculations for minutes and seconds
//     var m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
//     var s = Math.floor((distance % (1000 * 60)) / 1000);
//     var minutes = (m < 10 ? '0' + m : m);
//     var seconds = (s < 10 ? '0' + s : s);

//     $('#countdownTimer').html(minutes + ':' + seconds);

//     if (distance < 0) {
//         clearInterval(t);
//         $('#countdownTimer').html('00:00');
//         $("input[name='resumeTimer']").val('n');
//         $("input[name='expTime']").val('');
//     }
// }, 1000);


// function togglePasswordReveal() {
//     var x = document.getElementById("myInput");
//     if (x.type === "password") {
//         x.type = "text";
//     } else {
//         x.type = "password";
//     }
// }

// $('#closeErrorAlert').click(function() {
//     $('#errorAlert').slideUp(500);
// });
