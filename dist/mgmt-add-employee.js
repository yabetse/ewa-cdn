function generatePassword() {
    var length = 16,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}

var password = generatePassword();
$("#kn-input-field_9 .control input[name='password']").attr("value", password);
$("#kn-input-field_9 .control input[name='password_confirmation']").attr("value", password);
$("#field_14").attr("value", password);

$("#field_13").on('change', function() {
    var phone = $("#field_13").val()
    var email = phone + "@ewa-services.com";
    $("#field_8").attr("value", email);
});