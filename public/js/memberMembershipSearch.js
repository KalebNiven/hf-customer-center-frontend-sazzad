
$(document).ready(function() {

    $("#verifyChannelsModal").modal({backdrop: 'static', keyboard: false, show: true});

    $('input[name=searchMemberID]').on({
        keyup: function(e) {
            var input = $(this).val();

            input = input.replace(/([^0-9A-Za-z])/g,'');
            $('input[name=searchMemberID]').val(input);

            var charCode = (e.which) ? e.which : e.keyCode;
            if (charCode > 31 && (charCode < 48 || charCode > 57) && (charCode < 36 || charCode > 40)) {
                return false;
            }
            return true;
        }
    });

    $('input[name=searchNonMemberId]').on({
        keyup: function(e) {
            var input = $(this).val();

            input = input.replace(/([^0-9A-Za-z])/g,'');
            $('input[name=searchNonMemberId]').val(input);

            var charCode = (e.which) ? e.which : e.keyCode;
            if (charCode > 31 && (charCode < 48 || charCode > 57) && (charCode < 36 || charCode > 40)) {
                return false;
            }
            return true;
        }
    });

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

    $('input[name=searchNonMemberZipCode]').on({
        keyup: function(e) {
            var input = $(this).val();

            input = input.replace(/([^0-9])/g,'');
            $("input[name='searchNonMemberZipCode']").val(input);

            var charCode = (e.which) ? e.which : e.keyCode;
            if (charCode > 31 && (charCode < 48 || charCode > 57) && (charCode < 36 || charCode > 40)) {
                return false;
            }
            return true;
        }
    });

});
