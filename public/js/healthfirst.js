var lazyloaderHF = new LazyLoad({ threshold:0 });

// hide the resend MFA verification code for 30 seconds as per Okta rate limiting
$('#resendCodeLink').hide();
$('#resendCodeLink').delay(30000).show(0);

if ($('#registerForm').length) {
  showRegistrationFormFields();
}

$('#login-sign-in').click(function() {
    $(this).html('<i class=\"fas fa-circle-o-notch fa-spin\"></i>');
});

// format the phone number coming from the server to the one used for display on the client
var phone = $('input[name=mobile]').val();

if (typeof phone !== 'undefined' && phone.length) {
  phone = formatPhone(phone, 1);
  $('input[name=mobile]').val(phone);
}

var phone2 = $('input[name=phone]').val();

if (typeof phone2 !== 'undefined' && phone2.length) {
  phone2 = formatPhone(phone2, 1);
  $('input[name=phone]').val(phone2);
}

// toggle show password for password fields
$('#toggle-show-password').click(function() {
  if($("input[name='password']").attr('type') == 'password') {
    $(this).attr('src', '/img/password_hide.png');
    $("input[name='password']").attr('type', 'text');
    $("input[name='password_confirmation']").attr('type', 'text');
  } else {
    $(this).attr('src', '/img/password_show.png');
    $("input[name='password']").attr('type', 'password');
    $("input[name='password_confirmation']").attr('type', 'password');
  }
});

$('#show-confirmPassword').click(function() {
  $('#show-confirmPassword').hide();
  $('#hide-confirmPassword').show();
  $('#confirmPassword').attr('type', 'text');
});

$('#hide-confirmPassword').click(function() {
  $('#show-confirmPassword').show();
  $('#hide-confirmPassword').hide();
  $('#confirmPassword').attr('type', 'password');
});


// make sure the verificationToggle slider is properly set
// if ($('#verificationToggle').val() == 'MOBILE') {
//   $('#verificationToggleCheckbox').prop('checked', true);
//   $('#mobile-form').show();
//   $('#verificationToggle').val('MOBILE');
// } else {
//   $('#verificationToggleCheckbox').prop('checked', false);
//   $('#mobile-form').hide();
//   $('#verificationToggle').val('EMAIL');
// }

// make sure the publicDeviceToggle slider is properly set
if ($('#publicDeviceToggle').val() == 'PUBLIC') {
  $('#publicDeviceToggleCheckbox').prop('checked', true);
  $('#remember-form').hide();
  $('#publicDeviceToggle').val('PUBLIC');
} else {
  $('#publicDeviceToggleCheckbox').prop('checked', false);
  $('#remember-form').show();
  $('#publicDeviceToggle').val('PRIVATE');
}

$('#new-member-btn').click(function() {
  $('#memberType').val('NEW');
  $('input').removeClass('is-invalid');
  $('#member-reg-prompt').hide();
  $('#non-member-reg-prompt').show();
  $('span.error').hide();
  showRegistrationFormFields();
});

$('#existing-member-btn').click(function() {
  $('#memberType').val('EXISTING');
  $('input').removeClass('is-invalid');
  $('#member-reg-prompt').show();
  $('#non-member-reg-prompt').hide();
  $('span.error').hide();
  showRegistrationFormFields();
});

// $('#verificationToggleCheckbox').change(function() {
//   if ($(this).prop('checked')) {
//     $('#mobile-form').show();
//     $('#verificationToggle').val('MOBILE');
//   } else {
//     $('#mobile-form').hide();
//     $('#verificationToggle').val('EMAIL');
//   }
// });

$('#publicDeviceToggleCheckbox').change(function() {
  if ($(this).prop('checked')) {
    $('#remember-form').hide();
    $('#publicDeviceToggle').val('PUBLIC');
  } else {
    $('#remember-form').show();
    $('#publicDeviceToggle').val('PRIVATE');
  }
});

$('.otpCode').keyup(function(){
  var charLimit = 1;
  if (this.value.length >= charLimit){
    $(this).closest('div').next('div').find('input:text').focus();
    return false;
	}
});

$('#resend-code-link').click(function() {
  $('#resendCodeModal').modal('show');
});

$('#use-email-instead-link').click(function() {
  $('#useEmailInsteadModal').modal('show');
});

$('.membership-tile').on("click", function() {

    var membershipKey = $(this).attr("membershipKey");

    $('#changeMembershipKey').val(membershipKey);
    segmentTrack('Change membership');
    $('#changeMembershipForm').submit();
    $('#processingModal').modal({backdrop: 'static', keyboard: false, show: true});

});

$('input[name=mobile], input[name=phone]').on({
  // Format the phone number as the user types it
  keyup: function(e) {
    var input = $(this).val();

    // ex: (917) 111 - 2323
    input = formatPhone(input, 1);

    // Update the input field with the formatted value
    $(this).val(input);

    var charCode = (e.which) ? e.which : e.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && (charCode < 36 || charCode > 40)) {
      return false;
    }
    return true;
  }
});


$('input[name=DOBFULL]').on({
  // Format the phone number as the user types it
  keyup: function(e) {
    // ignore backspace key
    if (e.keyCode == 8) {
      return false;
    }

    var input = $(this).val();

    // Strip all characters from the input except digits
    input = input.replace(/\D/g,'');

    // Trim the remaining input to ten characters, to preserve phone number format
    input = input.substring(0,10);

    // Based upon the length of the string, we add formatting as necessary
    var size = input.length;
    if (size < 2) {
      input = input;
    } else if (size < 4) {
            input = input.substring(0,2)+'/'+input.substring(2,input.length);
    } else {
            input = input.substring(0,2)+'/'+input.substring(2,4)+'/'+input.substring(4,8);
    }

    // Update the input field with the formatted value
    $(this).val(input);

    var charCode = (e.which) ? e.which : e.keyCode;
    if(charCode > 31 && (charCode < 48 || charCode > 57) && (charCode < 36 || charCode > 40)){
      return false;
    }
    return true;
  }
});

$('input[name=DOB]').on({
  keyup: function(e) {
    if (e.keyCode == 8) {
      return false;
    }
    var input = $(this).val();
    input = input.replace(/\D/g,'').substring(0,4);
    if (input.length < 2) {
      input = input;
    } else {
      input = input.substring(0,2)+'/'+input.substring(2,input.length);
    }
    $(this).val(input);
    var charCode = (e.which) ? e.which : e.keyCode;
    if(charCode > 31 && (charCode < 48 || charCode > 57) && (charCode < 36 || charCode > 40)){
      return false;
    }
    return true;
  }
});


$( "#registerForm" ).submit(function( event ) {
  var phone = $('input[name=mobile]').val();
  phone = formatPhone(phone, 2);
  $('input[name=mobile]').val(phone);

  return true;
});

$( "#changePhoneForm" ).submit(function( event ) {
  var phone = $('input[name=phone]').val();
  phone = formatPhone(phone, 2);
  $('input[name=phone]').val(phone);

  return true;
});

$( "#resendPhoneCodeForm" ).submit(function( event ) {
  var phone = $('#resendPhoneCodeForm input[name=newPhone]').val();
  phone = formatPhone(phone, 2);
  $('#resendPhoneCodeForm input[name=phone]').val(phone);

  return true;
});


// make sure right form is presented to user
function showRegistrationFormFields() {
  if ($('#memberType').val() == 'NEW') {
    $('#existing-member-btn').removeClass('active').removeClass('arrow-box');
    $('#new-member-btn').addClass('active').addClass('arrow-box');

    $("input[name='memberId']").val('');
    $('#memberIdDiv').hide();

    $("input[name='lastName']").val('');
    $('#lastNameDiv').hide();

    $("input[name='DOBFULL']").val('');
    $('#DOBFULLDiv').hide();

    $("input[name='gender']").val('');
    $('#genderDiv').hide();

    $("input[name='zipCode']").val('');
    $('#zipCodeDiv').hide();

    $('#DOBDiv').show();

    $('#MPSRDiv').show();

  } else {
    $('#memberType').val('EXISTING');
    $('#new-member-btn').removeClass('active').removeClass('arrow-box');
    $('#existing-member-btn').addClass('active').addClass('arrow-box');

    $("input[name='DOB']").val('');
    $('#DOBDiv').hide();

    $("input[name='wantsMedicare']").attr('checked', false);
    $('#MPSRDiv').hide();

    $('#memberIdDiv').show();
    $('#lastNameDiv').show();
    $('#DOBFULLDiv').show();
    $('#genderDiv').show();
    $('#zipCodeDiv').show();
  }
}


function formatPhone(phone, format) {
  switch(format)
  {
    // ex: (917) 111 - 2323
    case 1:
      // Strip all characters from the input except digits
      phone = phone.replace(/\D/g,'');

      // Trim the remaining input to ten characters, to preserve phone number format
      phone = phone.substring(0,10);

      // Based upon the length of the string, we add formatting as necessary
      var size = phone.length;
      if (size == 0) {
        phone = phone;
      } else if (size < 4) {
              phone = phone;
      } else if (size < 7) {
              phone = phone.substring(0,3)+' - '+phone.substring(3,6);
      } else {
              phone = phone.substring(0,3)+' - '+phone.substring(3,6)+' - '+phone.substring(6,10);
      }

      break;
    // ex: 917-111-2323
    case 2:
    default:
      var phone = phone.replace(/\D/g,'');
      phone = phone.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
  }
  return phone;
}

// pass params to controller method to resend an Okta verification code/OTP
function resendVerifyCode(verifyMethodRoute)
{
    var qParams = {
        userId: $('input[name=userId]').val(),
        factorId: $('input[name=factorId]').val(),
        token: $('input[name=token]').val(),
        phone: $('input[name=phone]').val(),
        email: $('input[name=email]').val()
    };
    var qString = $.param(qParams);
    window.location = verifyMethodRoute + '?' + qString;
}

function stripHtmlTags(str)
{
    if ((str===null) || (str===''))
        return false;
    else
        str = str.toString();

    return str.replace( /(<([^>]+)>)/ig, '');
}


function getGreeting() {
  var greeting;
  var time = new Date().getHours();

  if (time < 12) {
      greeting = "Good morning";
  } else if (time < 17) {
      greeting = "Good afternoon";
  } else {
      greeting = "Good evening";
  }

  return greeting;
}


$('input[name=searchNonMemberDOB]').on({
  // Format the phone number as the user types it
  keyup: function(e) {
    // ignore backspace key
    if (e.keyCode == 8) {
      return false;
    }

    var input = $(this).val();

    // Strip all characters from the input except digits
    input = input.replace(/\D/g,'');

    // Trim the remaining input to ten characters, to preserve phone number format
    input = input.substring(0,10);

    // Based upon the length of the string, we add formatting as necessary
    var size = input.length;
    if (size < 2) {
      input = input;
    } else if (size < 4) {
            input = input.substring(0,2)+'/'+input.substring(2,input.length);
    } else {
            input = input.substring(0,2)+'/'+input.substring(2,4)+'/'+input.substring(4,8);
    }

    // Update the input field with the formatted value
    $(this).val(input);

    var charCode = (e.which) ? e.which : e.keyCode;
    if(charCode > 31 && (charCode < 48 || charCode > 57) && (charCode < 36 || charCode > 40)){
      return false;
    }
    return true;
  }
});

$('span.SSNSearch-btn').click(function() {
  $('#searchMemberIDForm').hide();
  $('#searchMemberSSNForm').show();
});

$('span.memberIDSearch-btn').click(function() {
  $('#searchMemberSSNForm').hide();
  $('#searchMemberIDForm').show();
});

$('span.nonMemberSSNSearch-btn').click(function() {
  $('#nonMemberSearchByMemberId').hide();
  $('#nonMemberSearchBySSN').show();
});

$('span.nonMemberIDSearch-btn').click(function() {
  $('#nonMemberSearchBySSN').hide();
  $('#nonMemberSearchByMemberId').show();
});

$('div.contactus-right').click(function() {
  sectiondiv = $('#contactus-box-' + $(this).attr("btn-num") + '-btm');
  sectiondiv.toggle();
  if (sectiondiv.is(":visible")) {
      $(this).html("-");
  }else {
      $(this).html("+");
  }

});

$('div.contactus-left').click(function() {
  sectiondiv = $('#contactus-box-' + $(this).attr("btn-num") + '-btm');
  sectiondiv.toggle();
  if (sectiondiv.is(":visible")) {
      $(this).siblings().html("-");
  }else {
      $(this).siblings().html("+");
  }
});

$('div.mobile-leftnav-burger').click(function() {
    $('#home-leftnav').fadeToggle();
    // $(this).fadeToggle();
    $('#home-main').fadeToggle();
});

$('.add-membership-link').click(function() {
  $('#addMembershipModal').modal('show');
});

$('#edit-username-link').click(function() {
  $('#editUsernameModal').modal('show');
});

$('#edit-password-link').click(function() {
  $('#editPasswordModal').modal('show');
});

$('#edit-email-link').click(function() {
  $('#editEmailModal').modal('show');
});

$('#edit-phone-link').click(function() {
  $('#editPhoneModal').modal('show');
});

$('#changeUsername').keyup(function(){
  var id = $('input[name=username]').val();

  if (id.length > 0) {
    $('#changeUsernameSubmitBtn').prop('disabled', false);
  } else {
    $('#changeUsernameSubmitBtn').prop('disabled', true);
  }
});


$('#phone').keyup(function(){
  var id = $('input[name=phone]').val();

  if (id.length > 0) {
    $('#changePhoneSubmitBtn').prop('disabled', false);
  } else {
    $('#changePhoneSubmitBtn').prop('disabled', true);
  }
});

$('button.close').click(function() {
    $('.dismissable-error').html("");
    $('.error').hide();
    $(':input:not([type=hidden])').removeClass('is-invalid')
    $(':input:not([type=hidden])').val("");
});

$('.long-load').click(function() {
    $('#processingModal').modal({backdrop: 'static', keyboard: false, show: true});
});

$('.external-site').click(function(event) {
    event.preventDefault();
    link = $(this).attr('href');
    target = $(this).attr('target');
    $('#externalSiteContinue').attr('href', link);
    $('#externalSiteContinue').attr('target', target);
    $('#externalSiteModal').modal('show');
});

$('.multipleplans').click(function(event) {
    event.preventDefault();
    redirectLink = $(this).attr('href');
    applicationName = $(this).attr('applicationName');
    target = $(this).attr('target');
    externalSite = $(this).attr('externalSite');
    $('.planSelectionLink').attr('redirectUrl', redirectLink);
    $('.planSelectionLink').attr('target', target);
    $('.planSelectionLink').attr('externalSite', externalSite);
    $('#applicationName').html(applicationName + ".");
    $('#selectPlanModal').modal('show');
});

$('.dependentplans').click(function(event) {
  event.preventDefault();
  redirectLink = $(this).attr('href');
  applicationName = $(this).attr('applicationName');
  target = $(this).attr('target');
  externalSite = $(this).attr('externalSite');
  $('.dependentSelectionLink').attr('redirectUrl', redirectLink);
  $('.dependentSelectionLink').attr('target', target);
  $('.dependentSelectionLink').attr('externalSite', externalSite);
  $('#applicationName').html(applicationName + ".");
  $('#selectPlanModal').modal('show');
});

$('#externalSiteContinue').click(function(event) {
    event.preventDefault();

    link = $(this).attr('href');
    target = $(this).attr('target');
    changeMembershipUrl = $(this).attr('changeMembershipUrl');

    $('#externalSiteModal').modal('hide');
    $('#selectPlanModal').modal('hide');
    $('#processingModal').modal({backdrop: 'static', keyboard: false, show: true});
    changeMemberships(changeMembershipUrl);
    $('#processingModal').modal('hide');
    window.open(link, target)
});

$('.planSelectionLink').click(function(event) {
  event.preventDefault();

  link = $(this).attr('href');
  redirectLink = $(this).attr('redirectUrl');
  target = $(this).attr('target');
  externalSite = $(this).attr('externalSite');
  // fullLink = link + '?redirectUrl=' + redirectLink + '&target=' + target + '&externalSite=' + externalSite;

  if(externalSite === 'false'){
    $('#selectPlanModal').modal('hide');
    $('#processingModal').modal({backdrop: 'static', keyboard: false, show: true});
    changeMemberships(link);
    window.location.href = redirectLink;
  } else {
    $('#externalSiteContinue').attr('href', redirectLink);
    $('#externalSiteContinue').attr('target', target);
    $('#externalSiteContinue').attr('changeMembershipUrl', link);
    $('#selectPlanModal').modal('hide');
    $('#externalSiteModal').modal('show');
  }
});

function changeMemberships(url) {
  $.ajax({
    url: url,
    type: "GET",
    async: false,
    cache: false,
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    },
    success: function(data) {
        
    },
    error: function(data) {
        
    }
  });
}

$('#toaster .toasterClose').click(function() {
  $('#toaster').hide();
});

$('#toaster').delay(4000).fadeOut(3000);

const hostname = document.location.hostname;
const subname = hostname.split('.')[0];
// To change when page loaded
if(subname.length === 2){ // Check if language is subdomain
  $('.multi-lang-sec a[data-lang='+subname+']').attr('style', 'color: #aaaaaa !important');
  $('.multi-lang-sec a[data-lang='+subname+']').attr("disabled", "disabled");
  $('.multi-lang-sec a[data-lang='+subname+']').css('cursor', 'default')
  $('#subdomain').attr("value", subname);
}
else{ // Else set to english
  $('.multi-lang-sec a[data-lang="en"]').attr('style', 'color: #aaaaaa !important');
  $('.multi-lang-sec a[data-lang="en"]').attr("disabled", "disabled");
  $('.multi-lang-sec a[data-lang="en"]').css('cursor', 'default')
}

/*
//////////////////////////////////////////////////////////
////////// Hover for Tool Tip Text ///////////////////////
//////////////////////////////////////////////////////////
var delay=1000, setTimeoutConst;
$(".tooltipper").hover(function(){
  console.log($(".tooltippertext", this).first());
  setTimeoutConst = setTimeout(function() {
    // do something
    $(".tooltippertext").attr('style', 'visibility: visible; opacity: 1;');
  }, delay);
}, function() {
  $(".tooltippertext").attr('style', 'visibility: hidden; opacity: 0;');
  clearTimeout(setTimeoutConst);
});
*/