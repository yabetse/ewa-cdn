// Disable the Submission Button
$("#view_60 .kn-button.is-primary").prop("disabled", true);

// Variables for Global Conditions
var requested_transactions = parseInt(
  $("#view_66 .kn-pivot-calc:eq(1)").text().replace(/,/g, "") == ""
    ? 0
    : $("#view_66 .kn-pivot-calc:eq(1)").text().replace(/,/g, "")
);
var max_number_requests = parseFloat(
  $("#view_64 .field_91 .kn-detail-body").text().replace(/,/g, "") == ""
    ? 0
    : $("#view_64 .field_91 .kn-detail-body").text().replace(/,/g, "")
);
var input_val = 0;

var cutoffs = Array();
$("#view_64 .kn-detail.field_82 .kn-detail-body span span span").each(
  function () {
    cutoffs.push($(this).text());
  }
);

var current_month =
  new Date().getFullYear() + "-" + (new Date().getMonth() + 1);
var months = Array();
$("#view_64 .kn-detail.field_88 .kn-detail-body span span span").each(
  function () {
    months.push($(this).text());
  }
);

for (var i = 0; i < months.length; i++) {
  if (months[i] == current_month) {
    var cutoff_day = cutoffs[i];
  }
}

// Calculate Withdrawable Amount Variables
var base_salary = parseFloat(
  $("#view_65 .field_44 .kn-detail-body").text().replace(/,/g, "") == ""
    ? 0
    : $("#view_65 .field_44 .kn-detail-body").text().replace(/,/g, "")
);
var requested_amount = parseFloat(
  $("#view_66 .kn-pivot-calc:eq(0)").text().replace(/,/g, "") == ""
    ? 0
    : $("#view_66 .kn-pivot-calc:eq(0)").text().replace(/,/g, "")
);
var withdrawable_threshold = parseFloat(
  $("#view_64 .field_89 .kn-detail-body").text().replace(/,/g, "") == ""
    ? 0
    : $("#view_64 .field_89 .kn-detail-body").text().replace(/,/g, "")
);

// Conditions Check Variables
var min_allowed_employee = parseFloat(
  $("#view_65 .field_52 .kn-detail-body").text().replace(/,/g, "") == ""
    ? 0
    : $("#view_65 .field_52 .kn-detail-body").text().replace(/,/g, "")
);
var max_allowed_employee = parseFloat(
  $("#view_65 .field_53 .kn-detail-body").text().replace(/,/g, "") == ""
    ? 0
    : $("#view_65 .field_53 .kn-detail-body").text().replace(/,/g, "")
);
var min_allowed_company = parseFloat(
  $("#view_64 .field_87 .kn-detail-body").text().replace(/,/g, "") == ""
    ? 0
    : $("#view_64 .field_87 .kn-detail-body").text().replace(/,/g, "")
);
var max_allowed_company = parseFloat(
  $("#view_64 .field_90 .kn-detail-body").text().replace(/,/g, "") == ""
    ? 0
    : $("#view_64 .field_90 .kn-detail-body").text().replace(/,/g, "")
);

var normal_fee_setting = parseFloat(
  $("#view_64 .field_93 .kn-detail-body").text().replace(/,/g, "") == ""
    ? 0
    : $("#view_64 .field_93 .kn-detail-body").text().replace(/,/g, "")
);
var fast_fee_setting = parseFloat(
  $("#view_64 .field_94 .kn-detail-body").text().replace(/,/g, "") == ""
    ? 0
    : $("#view_64 .field_94 .kn-detail-body").text().replace(/,/g, "")
);

if (min_allowed_employee > 0 && min_allowed_company > 0) {
  var min_allowed = Math.max(min_allowed_employee, min_allowed_company);
} else if (min_allowed_employee > 0) {
  var min_allowed = min_allowed_employee;
} else if (min_allowed_company > 0) {
  var min_allowed = min_allowed_company;
} else {
  var min_allowed = 0;
}

if (max_allowed_employee > 0 && max_allowed_company > 0) {
  var max_allowed = Math.min(max_allowed_employee, max_allowed_company);
} else if (max_allowed_employee > 0) {
  var max_allowed = max_allowed_employee;
} else if (max_allowed_company > 0) {
  var max_allowed = max_allowed_company;
} else {
  var max_allowed = 0;
}

// Get withdrawal fee value
var speed = $('input[name="view_60-field_92"]:checked').val();
if (speed.toLowerCase().indexOf("normal") > -1) {
  var withdrawal_fee = normal_fee_setting;
} else if (speed.toLowerCase().indexOf("fast") > -1) {
  var withdrawal_fee = fast_fee_setting;
}
$("#view_60 #field_63").attr("value", withdrawal_fee);
var available_amount = calculate_withdrawable(
  base_salary,
  requested_amount,
  withdrawal_fee,
  withdrawable_threshold
);

$("input[type=radio][name=view_60-field_92]").change(function () {
  var input_val = $("#field_18").val();
  var speed = $('input[name="view_60-field_92"]:checked').val();
  if (speed.toLowerCase().indexOf("normal") > -1) {
    withdrawal_fee = normal_fee_setting;
  } else if (speed.toLowerCase().indexOf("fast") > -1) {
    withdrawal_fee = fast_fee_setting;
  }
  $("#view_60 #field_63").attr("value", withdrawal_fee);
  available_amount = calculate_withdrawable(
    base_salary,
    requested_amount,
    withdrawal_fee,
    withdrawable_threshold
  );
  var output = amount_requested_checks(
    available_amount,
    min_allowed,
    max_allowed,
    cutoff_day,
    requested_transactions,
    max_number_requests,
    input_val
  );
  display_message(output);
});

$("input#field_18").on("input", function (e) {
  var input_val = $(this).val();
  var speed = $('input[name="view_60-field_92"]:checked').val();
  if (speed.toLowerCase().indexOf("normal") > -1) {
    withdrawal_fee = normal_fee_setting;
  } else if (speed.toLowerCase().indexOf("fast") > -1) {
    withdrawal_fee = fast_fee_setting;
  }
  available_amount = calculate_withdrawable(
    base_salary,
    requested_amount,
    withdrawal_fee,
    withdrawable_threshold
  );
  var output = amount_requested_checks(
    available_amount,
    min_allowed,
    max_allowed,
    cutoff_day,
    requested_transactions,
    max_number_requests,
    input_val
  );
  display_message(output);
});

calculate_withdrawable = function (
  base_salary,
  requested_amount,
  withdrawal_fee,
  withdrawable_threshold
) {
  var current_date = new Date();
  var mtd = current_date.getDate() - 1;
  var tot = new Date(
    current_date.getFullYear(),
    current_date.getMonth() + 1,
    0
  ).getDate();
  var balance = (base_salary * mtd) / tot;
  var available_amount = (balance - requested_amount) * withdrawable_threshold;
  return available_amount;
};

amount_requested_checks = function (
  withdrawable_amount,
  min_allowed,
  max_allowed,
  cutoff_day,
  nb_requests,
  max_nb_requests,
  input_val
) {
  // condition1 : cutoff date
  var cond1 =
    new Date() <=
    new Date(
      cutoff_day.split("/")[2],
      cutoff_day.split("/")[1] - 1,
      cutoff_day.split("/")[0]
    );

  // condition2: total number of requests per month
  var cond2 = max_nb_requests <= 0 || nb_requests < max_nb_requests;

  // condition3: input in range
  var max_allowed_bis = Math.min(max_allowed, withdrawable_amount);
  if (max_allowed > 0) {
    var cond3 =
      input_val >= min_allowed &&
      input_val <= max_allowed &&
      input_val <= withdrawable_amount;
  } else {
    var cond3 = input_val >= min_allowed && input_val <= withdrawable_amount;
  }

  // compiling all
  if (cond1 == false) {
    return {
      status: false,
      error: "Please wait until next month to submit new requests",
    };
  } else if (cond2 == false) {
    return {
      status: false,
      error:
        "You have exceeded the maximum number of requests allowed per month",
    };
  } else if (cond3 == false && max_allowed > 0) {
    return {
      status: false,
      error:
        "Please provide an amount between " +
        min_allowed.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
        " and " +
        max_allowed_bis.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
    };
  } else if (cond3 == false) {
    return {
      status: false,
      error:
        "Please provide an amount greater than " +
        min_allowed.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
    };
  } else {
    return { status: true };
  }
};

display_message = function (json_obj) {
  if (json_obj["status"] == false) {
    var error_msg = json_obj["error"];
    $(".error-message-custom").hide();
    $(".validation-message-custom").hide();
    $(
      "<div class='error-message-custom'><strong>" +
        error_msg +
        "</strong></div>"
    ).insertAfter($("#view_60 .view-header"));
    // setTimeout(hide_error, 5000);
  }

  if (json_obj["status"] == true) {
    $(".error-message-custom").hide();
    $(".validation-message-custom").hide();
    $(
      "<div class='validation-message-custom'><strong>All inputs are correct</strong></div>"
    ).insertAfter($("#view_60 .view-header"));
    $("#view_60 .kn-button.is-primary").prop("disabled", false);
  } else {
    $("#view_60 .kn-button.is-primary").prop("disabled", true);
  }
};

$(document).on("knack-form-submit.view_60", function (event, view, record) {
  $(".error-message-custom").hide();
  $(".validation-message-custom").hide();
});
