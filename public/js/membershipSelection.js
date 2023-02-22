$(document).ready(function() {

    var modalConfirm = function(callback) {
        var btn  = '',
            action = '',
            membershipInfo = '';

        $("a.membership-report, button.membership-attach").on('click', function() {
            // $(this).html('<i class=\"fas fa-circle-o-notch fa-spin\"></i>');
            btn = $(this).attr('id').replace(/\|/g, '\\|').replace(/\+/g, '\\+');
            action = $(this).attr('action');

            if(action == 'report') {
                $('#attach-dismiss').hide();
                $('#confirm-attach').hide();
                $('#confirm-report').show();
                $('#report-dismiss').show();
                $('#action-title').html('Report Error');
                $('#action-text').html('This membership will be removed from <br/>your account. Are you sure you want to <br/>continue?');
                // $('#modal-disclaimer').html('By selecting this you are saying the membership details listed below is not you or you do not recognize it');
            } else if(action == 'attach') {
                $('#report-dismiss').hide();
                $('#confirm-report').hide();
                $('#confirm-attach').show();
                $('#attach-dismiss').show();
                $('#action-title').html('Add to Account');
                $('#action-text').html('Are you sure you want to add this <br/>membership to your account?');
                // $('#modal-disclaimer').html('');
            }


            $("#confirm-modal").modal('show');
        });

        $("#confirm-report, #confirm-attach").on('click', function() {
            callback(btn, action);
            $("#confirm-modal").modal('hide');
        });
    };


    modalConfirm(function(btn, action) {
        btn = '#' + btn;
        var membershipKey = $(btn).attr('membershipKey').replace(/\|/g, '\\|').replace(/\+/g, '\\+');
        var memberData = {
            membershipId: $(btn).attr('membershipId').replace(/\|/g, '\\|').replace(/\+/g, '\\+'),
            membershipKey: $(btn).attr('membershipKey').replace(/\|/g, '\\|').replace(/\+/g, '\\+'),
            membershipFirstName: $(btn).attr('membershipFirstName'),
            membershipLastName: $(btn).attr('membershipLastName'),
            membershipZip: $(btn).attr('membershipZip'),
            membershipGender: $(btn).attr('membershipGender'),
            membershipDOB: $(btn).attr('membershipDOB')
        };

        memberData.membershipKey = memberData.membershipKey.replace(/\\/g, ''),
        memberData.membershipId  = memberData.membershipId.replace(/\\/g, ''),

        $(this).html('<i class=\"fas fa-circle-o-notch fa-spin\"></i>');

        $.ajax({
          url: "/"+action+"Account",
          type: "POST",
          data: memberData,
          headers: {
              'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
          },
          success: function(data) {
              if (action == 'report') {
                  $('#card-'+membershipKey).hide();
              }else{
                  $(btn).html('<i class="fas fa-check-circle"></i>  <span style="font-weight: normal">Added</span>');
                  $(btn).addClass("attached-membership-btn");
                  $(btn).prop('disabled', true);
                  $('#report-'+membershipKey+'-div').html("");
              }
          },
          error: function(data) {
              // $('#spinner-' + membershipKey).hide();
              // $('#'+action+'-account-failure-' + membershipKey).show();
          }
        });

    });

});
