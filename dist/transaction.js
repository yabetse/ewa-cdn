// transactions
$(document).on('knack-view-render.view_47', function (event, view, data) {
    console.log("Transaction view loaded");
    createTransactionList();

    $('.transaction-item .btn-toggle').click(function () {
        let ti = $(this).parents('.transaction-item');

        $(this).toggleClass('selected')
        $(ti).find('.ti-contnet').toggleClass('hidden-detail');

        $('html, body').animate({
            scrollTop: $(ti).offset().top + ($(ti).height() / 3)
        }, 1000);
    });

    $('#transaction-search-bar input').keyup(function () {
        let searchBar = $(this).parents('.custom-search-bar');
        let searchInputCont = $(searchBar).find('.search-input-cont');
        let clearInput = $(searchBar).find('#clear');
        let searchString = $(this).val().trim();

        if (searchString !== "") {
            $(clearInput).removeClass('hidden');

            if (!$(searchInputCont).hasClass('search-offset'))
                $(searchInputCont).addClass('search-offset');

            searchTransactions(searchString);

        } else {
            resetSearchBar();
        }
    });

    $('#transaction-search-bar #clear').click(function () {
        let searchBar = $(this).parents('.custom-search-bar');
        let input = $(searchBar).find('input.form-input');

        $(input).val('');
        resetSearchBar();
    });
});

// Searchs transaction list
function searchTransactions(queryString) {
    $('.transaction-item').each(function () {
        if ($(this).text().search(new RegExp(queryString, "i")) < 0) {
            $(this).hide();
        } else {
            $(this).show();
        }
    });
}

//  Resets the search bar state if there's not input
function resetSearchBar() {
    let searchInputCont = $('#transaction-search-bar .search-input-cont');
    let clearInput = $('#transaction-search-bar #clear');

    if (!$(clearInput).hasClass('hidden')) $(clearInput).addClass('hidden');

    $(searchInputCont).removeClass('search-offset');
    searchTransactions('');
}

// Sets the transaction item status class
function getStatusClass(status) {
    switch (status) {
        case "Paid Out":
            return "status-payed";
        case "In Progress":
            return "status-pending";
        default:
            return "status-rejected";
    }
}

// Sets the transaction icon based on transaction status
function setStatusIcon(status) {
    switch (status) {
        case "Paid Out":
            return `<span class="material-icons status-icon status-payed">done_outline</span>`;
        case "In Progress":
            return `<span class="material-icons status-icon status-pending">hourglass_bottom</span>`;
        default:
            return `<span class="material-icons status-icon status-error">do_not_disturb_on</span>`;
    }
}

// Parses transaction list from form
function parseTransactions() {
    let transactions = [];

    $(".kn-list-content .kn-list-item-container").each(function () {
        let transaction = {};

        $(this).find('.kn-detail').each(function () {
            let label = $(this).find('.kn-detail-label span span').text();

            let detailKey = label.split(' ').join('');
            let detailVal = $(this).find('.kn-detail-body span span').text();

            if (detailKey === 'BankAccount')
                detailVal = $(this).find('.kn-detail-body span span span').text();

            transaction[detailKey] = {
                "label": label,
                "value": detailVal
            };
        });

        transactions.push(transaction);
    });

    return transactions;
}

// Parses and returns formatted date
function formatDate(stringDate) {
    let date = new Date(stringDate);

    let year = date.getFullYear();

    let month = date.toLocaleString('default', {
        month: 'long'
    });

    let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();

    return `${month} ${day}, ${year}`;
}

// Creates content detail rows
function createDetailRows(transaction) {
    let detailRows = "";
    for (const detail in transaction) {

        if (detail === 'PWATotalAmount') continue;

        let value = transaction[detail].value;
        if (detail === 'RequestDate') {
            let formattedDate = formatDate(value.substring(0, 10));
            let time = value.substring(10, value.length);

            value = formattedDate.concat(' at', time);
        }

        if (detail === "WithdrawalSpeed") {
            let speed = value.split('-');

            value = `
                <span class='withdrawal-speed'>
                    <span class='ws-title'>${speed[0]}</span>
                    <span class='ws-desc'>${speed[1]}<span>
                </span>
            `
        }

        let row = `
            <div class="ti-content-row">
                <span class="ti-row-label">
                    ${transaction[detail].label}
                </span>

                <span class="ti-row-value ${detail === 'Status' && getStatusClass(value)}">
                    ${value || '-'}
                </span>
            </div>
        `

        detailRows += row;
    }
    return detailRows;
}

// Creates the transaction list 
function createTransactionList() {
    let transactions = parseTransactions();

    let transactionsCont = $('.transaction-list-container');

    transactions.forEach(transaction => {

        let formattedDate = formatDate(transaction.RequestDate.value.substring(0, 10));

        let transactionTemplate = `
            <div class="transaction-item ${getStatusClass(transaction.Status.value)}">
                <div class="ti-header">
                    <div class="ti-header-tgl">
                        <span class="ti-withdrawal-date">${formattedDate}</span>

                        <span class="btn-toggle material-icons">
                            expand_more
                        </span>
                    </div>

                    <div class="ti-header-amount">
                        <span class="ti-amount">${transaction.PWANetAmount.value}</span>

                        ${setStatusIcon(transaction.Status.value)}
                    </div>
                </div>

                <div class="ti-contnet hidden-detail">
                    ${createDetailRows(transaction)}
                </div>
            </div>
        `
        transactionsCont.append(transactionTemplate);
    });
}