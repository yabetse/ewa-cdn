// Custom validation for Thai phone number
$.validator.addMethod('thaiPhone', function (value, element) {
    value = value.replace(/\s+/g, "");

    // Regex for Thai phone - /(\+66)(\d{1,2}\-?\d{3}\-?\d{3,4})/
    return this.optional(element) || value.length == 9 && value.match(/(\d{1,2}\-?\d{3}\-?\d{3,4})/);

}, "Please enter a valid phone number");

// Disable phone number input form click events
function disablePhonenumberInputClickEvents() {
    $('button#request_otp').prop('disabled', true);
    $('input#phone_number').prop('disabled', true);
    $('#phoneNumberInput .btn-switch-login').css('pointer-events', 'none');
}

// Disable phone number input form click events
function enablePhonenubmerInputClickEvents() {
    $('button#request_otp').prop('disabled', false);
    $('input#phone_number').prop('disabled', false);
    $('#phoneNumberInput .btn-switch-login').css('pointer-events', '');
}

// Disable OTP entry form click events
function disableOTPEntryClickEvents() {
    $('button#validate_otp').prop('disabled', true);
    $('input#otp_code').prop('disabled', true);
    $('#validate-otp-form .login-selection').css('pointer-events', 'none');
    $('.btn-otp-back').css('pointer-events', 'none');
}

// Enable OTP entry form click events
function enableOTPEntryClickEvents() {
    $('button#validate_otp').prop('disabled', false);
    $('input#otp_code').prop('disabled', false);
    $('#validate-otp-form .login-selection').css('pointer-events', '');
    $('.btn-otp-back').css('pointer-events', '');
}

// Show OTP code entry after phone number is validated
function showOTPEntryView() {
    $('.view-group-2').hide();
    $('.view_45 .form-cont').removeClass('hidden-block');

    $('.otp-back-cont').removeClass('hidden');

    $('#login-graphic-2').addClass('img-hidden');
    $('#login-graphic-3').removeClass('img-hidden');
}

// Send OTP to validated phone number
function sendOTP(callback) {

    $('#kn-loading-spinner').show();

    // 66-[9 digit number]
    let phoneNr = "66".concat($('#phone_number').val());

    // set phone number to OTP entry 
    $('#otpNumber').text('+'.concat(phoneNr));

    $.ajax({
        //url:'https://www.promptpay.asia/pwa/send_sms.php?to=' + phoneNr
        url: 'https://ewaservices.ddns.net/ewa/send_sms.php?to=' + phoneNr
    }).done(function (response) {

        $('#kn-loading-spinner').hide();

        if (callback) callback();
    });
}

// Submit OTP and login
function submitOTP() {
    let OTPCode = $('input#otp_code').val();
    let phoneNr = "66".concat($('#phone_number').val());

    $('#kn-loading-spinner').show();
    disableOTPEntryClickEvents();

    $.ajax({
        //url:'https://www.promptpay.asia/pwa/validate_otp.php?to=' + phoneNr + '&otp=' +  OTPCode
        url: 'https://ewaservices.ddns.net/ewa/validate_otp.php?to=' + phoneNr + '&otp=' + OTPCode
    }).done(function (response) {
        var obj = $.parseJSON(response);

        $('#kn-loading-spinner').hide();
        enableOTPEntryClickEvents();

        if (obj.success) {
            $('input#email').val(obj.email);
            $('input#password').val(obj.password);
            $('form.login_form').submit();
        } else {
            alert(obj.details);
        }
    });
}

// Show OTP sent alert after resend request
function showOTPSentAlert() {
    $(`
        <div class="alert-otp-resent">
            <span class="material-icons">
                chat_bubble
            </span>

            OTP has been sent
        </div>
    `).insertBefore('#validateOTP .view-header');


    // remove alert from view
    setTimeout(function () {
        $('.alert-otp-resent').remove();
    }, 5000)

}

// Validate OTP phone number
$('#otp-input-form').validate({
    rules: {
        phone_number: {
            required: true,
            thaiPhone: true
        }
    },
    messages: {
        phone_number: "Please enter a valid phone number"
    },
    errorPlacement: function (error, element) {
        error.insertAfter(element.parent());
    },
    submitHandler: function (_, event) {
        event.preventDefault();

        disablePhonenumberInputClickEvents();

        sendOTP(() => {
            enablePhonenubmerInputClickEvents();
            showOTPEntryView()
        });
    },
});

// validate OTP 
$('#validate-otp-form').validate({
    rules: {
        otp_code: {
            required: true,
            minlength: 4,
            maxlength: 4,
        }
    },
    messages: {
        otp_code: {
            required: "Please enter a valid OTP code",
            minlength: "OTP code must be 4 characters",
            maxlength: "OTP code must be 4 characters"
        },
    },
    errorPlacement: function (error, element) {
        error.insertAfter(element.parent());
    },
    submitHandler: function (form, event) {
        event.preventDefault();
        submitOTP();
    },
})

// Resend OTP
$('#validate-otp-form .login-selection').click(() => {
    disableOTPEntryClickEvents();

    sendOTP(() => {
        showOTPSentAlert();
        enableOTPEntryClickEvents();
    })
});