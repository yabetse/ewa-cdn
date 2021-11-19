requests_check = function (cutoff_day, nb_requests, max_nb_requests) {
    // condition1 : cutoff date
    if (cutoff_day == "-") {
      var cond1 = false;
    } else {
      var cond1 = new Date() <= new Date(cutoff_day.split("/")[2], cutoff_day.split("/")[1] - 1, cutoff_day.split("/")[0]);
    }
  
    // condition2: total number of requests per month
    var cond2 = max_nb_requests <= 0 || nb_requests < max_nb_requests;
  
    // compiling all
    if (cond1 && cond2) {
      return true;
    } else {
      return false;
    }
  };
  
// Payoff and Cutoff Dates --> code to be optimized
var current_month = new Date().getFullYear() + "-" + (new Date().getMonth() + 1);

var months = Array();
$("#view_68 .kn-detail.field_88 .kn-detail-body span span span").each(
  function () {
    months.push($(this).text());
  }
);

var payoffs = Array();
$("#view_68 .kn-detail.field_76 .kn-detail-body span span span").each(
  function () {
    payoffs.push($(this).text());
  }
);

var cutoffs = Array();
$("#view_68 .kn-detail.field_82 .kn-detail-body span span span").each(
  function () {
    cutoffs.push($(this).text());
  }
);

for (var i = 0; i < months.length; i++) {
  if (months[i] == current_month) {
    var payday = payoffs[i];
    var cutoff_day = cutoffs[i];
  }
}

if (payoffs.length == 0) {
  var payday = "-";
}

if (cutoffs.length == 0) {
  var cutoff_day = "-";
}

// Withdrawable Amount and Other Conditions

var base_salary = parseFloat($("#view_51 .field_44 .kn-detail-body").text().replace(/,/g, "") == "" ? 0 : $("#view_51 .field_44 .kn-detail-body").text().replace(/,/g, ""));
var requested_amount = parseFloat($("#view_52 .kn-pivot-calc:eq(0)").text().replace(/,/g, "") == "" ? 0 : $("#view_52 .kn-pivot-calc:eq(0)").text().replace(/,/g, ""));
var requested_transactions = parseInt($("#view_52 .kn-pivot-calc:eq(1)").text().replace(/,/g, "") == "" ? 0 : $("#view_52 .kn-pivot-calc:eq(1)").text().replace(/,/g, ""));

var max_number_requests = parseFloat($("#view_68 .field_91 .kn-detail-body").text().replace(/,/g, "") == "" ? 0 : $("#view_68 .field_91 .kn-detail-body").text().replace(/,/g, ""));
var withdrawable_threshold = parseFloat($("#view_68 .field_89 .kn-detail-body").text().replace(/,/g, "") == "" ? 0 : $("#view_68 .field_89 .kn-detail-body").text().replace(/,/g, ""));

var current_date = new Date();
var mtd = current_date.getDate() - 1;
var tot = new Date(current_date.getFullYear(), current_date.getMonth() + 1, 0).getDate();

var balance = (base_salary * mtd) / tot;
var available_amount = balance - requested_amount;

// Compiling the HTML

var check = requests_check(cutoff_day, requested_transactions, max_number_requests);

var html = '<section id="custom-view-scene1">'
          +   '<div class="payday-wrapper">'
          +      '<div>'
          +         '<div class="payday-label">Next Payday</div>'
          +         '<div class="payday-value">' + payday + '</div>'
          +         '<span class="cutoff-message"><i>Withdrawals until ' + cutoff_day + '</i></span>'
          +      '</div>'
          +      '<img src="https://ewa-services.com/ewa/images/ico-calendar.svg"/>'
          +   '</div>'
          +   '<div class="max-withdrawable">'
          +      '<div class="max-withdrawable-label">Maximum Withdrawable Amount</div>'
          +      '<div class="max-amount-button">'
          +         '<span>' + (available_amount * withdrawable_threshold).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</span>'
          +         '<a' + (check == true ? ' href="' + window.location.pathname + '#request"' : ' style="pointer-events:none;" class="disabled"') + '>Withdraw</a>'
          +      '</div>'
          +   '</div>'
          +'</section>';

$(html).insertBefore($("#kn-scene_1"));
