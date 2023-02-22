$('input[name=memberId]').on({
    keyup: function(e) {
        var input = $(this).val();

        input = input.replace(/([^0-9A-Za-z])/g,'');
        $("input[name='memberId']").val(input);

        var charCode = (e.which) ? e.which : e.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57) && (charCode < 36 || charCode > 40)) {
        return false;
        }
        return true;
    }
});

$('input[name=zipCode]').on({
    keyup: function(e) {
        var input = $(this).val();

        input = input.replace(/([^0-9])/g,'');
        $("input[name='zipCode']").val(input);

        var charCode = (e.which) ? e.which : e.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57) && (charCode < 36 || charCode > 40)) {
        return false;
        }
        return true;
    }
});


