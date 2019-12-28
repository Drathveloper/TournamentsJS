
/* Show the actual year in footer */

$(function () {
    $('#copyright').text('© ' + moment(new Date()).format('YYYY') + ' All Rights Reserved');
});