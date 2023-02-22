var showRightPanel = false;

$(document).ready(function(){
    var anchor = window.location.hash;

    $('#accountInformation').show();
    $('#yourHealthfirstPlans').hide();

    if (anchor == '#plans') {
        showRightPanel = true;
        $('#accountInformation').hide();
        $('#yourHealthfirstPlans').show();
        $('#previousPlansTab').addClass("active-tab");
        $('#activePlansTab').removeClass("active-tab");
        $('#health-plans').addClass("active-card");
        $('#health-plans').siblings().removeClass("active-card");
        planToggle(1)
    }
    else{
        planToggle(0)
    }

    function checkWidth(){
        if ($(window).width() > 768) {
            $('div.left-panel').show();
            $('div.right-panel').show();
        }
        else{
            if(showRightPanel){
                $('div.left-panel').hide();
                $('div.right-panel').show();
            }
            else{
                $('div.left-panel').show();
                $('div.right-panel').hide();
            }
        }
    }
    checkWidth();

    $(window).resize(checkWidth);
});

$('.settings-nav-card.settings-nav-card-link').click(function() {
	$(this).addClass("active-card");
    $(this).siblings().removeClass("active-card");
    showRightPanel = true;
});

$('.findcare-nav-card.findcare-nav-card-link').click(function() {
	$(this).addClass("active-card");
    $(this).siblings().removeClass("active-card");
    showRightPanel = true;
});

function accountToggle(tab){
    if(tab===0){
        $('#accountInformation').show();
        $('#yourHealthfirstPlans').hide();
        responsivePanelToggle();
    } else if (tab ===1) {

        $('#accountInformation').hide();
        $('#yourHealthfirstPlans').show();
        responsivePanelToggle();
    } else {
        $('#accountInformation').hide();
        $('#yourHealthfirstPlans').hide();
    }
}

function findCareToggle(tab){
    if(tab===0){
        $('#searchForCare').addClass('col-md-10 d-lg-block col-lg-8 active-panel');
        $('#primaryHealthCare').removeClass('col-md-10 d-lg-block col-lg-8 active-panel');
        $('#benefits').removeClass('col-md-10 d-lg-block col-lg-8 active-panel');
        $('#searchForCare').show();
        $('#primaryHealthCare').hide();
        $('#benefits').hide();
        responsivePanelToggle();
    } else if (tab ===1) {
        $('#primaryHealthCare').addClass('col-md-10 d-lg-block col-lg-8 active-panel');
        $('#searchForCare').removeClass('col-md-10 d-lg-block col-lg-8 active-panel');
        $('#benefits').removeClass('col-md-10 d-lg-block col-lg-8 active-panel');
        $('#searchForCare').hide();
        $('#benefits').hide();
        $('#primaryHealthCare').show();
        responsivePanelToggle();
    } else if (tab ===2) {
        $('#benefits').addClass('col-md-10 d-lg-block col-lg-8 active-panel');
        $('#primaryHealthCare').removeClass('col-md-10 d-lg-block col-lg-8 active-panel');
        $('#searchForCare').removeClass('col-md-10 d-lg-block col-lg-8 active-panel');
        $('#searchForCare').hide();
        $('#primaryHealthCare').hide();
        $('#benefits').show();
        responsivePanelToggle();
    } else {
        $('#searchForCare').hide();
        $('#primaryHealthCare').hide();
        $('#benefits').hide();
    }
}

function responsivePanelToggle(){
    if ($(window).width() <= 768) {
        $('div.left-panel').hide();
        $('div.right-panel').show();
    }
}

$('.healthPlanTabs').click(function() {
	$(this).addClass("active-tab");
	$(this).siblings().removeClass("active-tab");
});

$('.settings-back-btn').click(function() {
    $('div.left-panel').show();
    $('div.right-panel').hide();
    showRightPanel = false;
});

// Toggle between Active vs Previous plans view
function planToggle(tab){
  if(tab===0){
    $('#activePlans').show();
    $('#previousPlans').hide();
  }
  else{
    $('#activePlans').hide();
    $('#previousPlans').show();
  }
}

function checkForgotPasswordForm() {
    var verificationCode = $('input[name=verificationCode]').val();

    if (verificationCode.length > 0) {
        $('#forgot-password-next').prop('disabled', false);
        $('#forgot-password-next').removeClass('btn-inactive');
        $('#forgot-password-next').addClass('btn-primary');
    } else {
        $('#forgot-password-next').prop('disabled', true);
        $('#forgot-password-next').removeClass('btn-primary');
        $('#forgot-password-next').addClass('btn-inactive');
    }
}

$('#verificationCode').on('keyup keypress blur change', function checkMFAVerifyCodeForm() {
    var verificationCode = $('input[name=verificationCode]').val();

    if (verificationCode.length > 0) {
        $('#verifyCodeSubmitBtn').prop('disabled', false);
        $('#verifyCodeSubmitBtn').removeClass('btn-inactive');
        $('#verifyCodeSubmitBtn').addClass('btn-primary');
    } else {
        $('#verifyCodeSubmitBtn').prop('disabled', true);
        $('#verifyCodeSubmitBtn').removeClass('btn-primary');
        $('#verifyCodeSubmitBtn').addClass('btn-inactive');
    }
});

