$(document).ready(function() {
    $('#notificationModal').modal('show');
    $('#announcementsOk, #notificationDismiss').on('click', logUserNotified);
});


function logUserNotified() {
    var OktaId = $('input[name="okta_id"]').val();
    var notificationId = $('input[name="notification_id"]').val();

    console.log('OktaId: ' + OktaId);
    $.ajax({
        type: "POST",
        url: '/api/userNotified',
        data: {okta_id: OktaId, notification_id: notificationId },
        success: function (response) {
            // console.log(response);
        },
        error: function (error) {
            // console.log(error);
        }

    });
}