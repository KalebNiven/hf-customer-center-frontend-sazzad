$(function() {
    $('input[type=radio][name="channel"]').click(function() {

        var data = JSON.parse($('#mfa-selection-submit').attr('segment-props'));
        if($(this).is('input#smsRadio')){
            data.account_property = 'primary phone';
        }else{
            data.account_property = 'primary email';
        }
        $('#mfa-selection-submit').attr('segment-props', JSON.stringify(data));
    });
});

