$(function() {
    $('input[type=radio][name="membershipStatus"]').click(function() {
        $('#continue-reg').prop('disabled', false);
        $('#continue-reg').removeClass('btn-inactive');
        $('#continue-reg').addClass('btn-primary');

        
        var data = JSON.parse($('#continue-reg').attr('segment-props'));
        if($(this).is('input#activeMember')){
            data.account_type = 'member';
        }else{
            data.account_type = 'non-member';
        }
        $('#continue-reg').attr('segment-props', JSON.stringify(data));
    });
});

