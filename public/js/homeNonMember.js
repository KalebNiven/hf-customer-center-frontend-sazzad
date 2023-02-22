$('#memberId, #firstName, #lastName, #DOBFULL, #zipCode').on('keyup keypress blur change', function(){
  var memberId = $('input[name=memberId]').val();
  var firstName = $('input[name=firstName]').val();
  var lastName = $('input[name=lastName]').val();
  var dob = $('input[name=DOBFULL]').val();
  var zipCode = $('input[name=zipCode]').val();

  if (memberId.length > 0 && firstName.length > 0 && lastName.length > 0 && dob.length > 0 && zipCode.length > 0) {
    $('#addMembershipSubmitBtn').prop('disabled', false);
  } else {
    $('#addMembershipSubmitBtn').prop('disabled', true);
  }
});


$('#addMembershipSubmitBtn').click(function() {
    $(this).html('<i class=\"fas fa-circle-o-notch fa-spin\"></i>');
});

$('#verificationCode').keyup(function(){
  var code = $('input[name=verificationCode]').val();

  if (code.length > 0) {
    $('#verifyCodeSubmitBtn').prop('disabled', false);
  } else {
    $('#verifyCodeSubmitBtn').prop('disabled', true);
  }
});

$('#dismiss-fyi').click(function() {
  $('#fyi-tip').slideUp('slow', function() {});
});