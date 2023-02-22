$('input[name=username]').on({
    keyup: function(e) {
    var input = $(this).val();

    input = input.replace(/([^\w\._@])/g,'');
    $("input[name='username']").val(input);

    var charCode = (e.which) ? e.which : e.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && (charCode < 36 || charCode > 40)) {
        return false;
    }
    return true;
    }
});