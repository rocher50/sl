(function($) {

    $(document).ready(function() {
        var calendars = document.getElementsByClassName("calendar");
        var c;
        for(c = 0; c < calendars.length; c++) {
            var calendar = calendars[c];
            var year = calendar.getElementsByClassName("year-var")[0].innerHTML;
            var month = calendar.getElementsByClassName("month-var")[0].innerHTML;
            var days = calendars[c].getElementsByClassName("days")[0];
            var anchors = days.getElementsByTagName("a");
            var d;
            for(d = 0; d < anchors.length; d++) {
                var dayAnchor = anchors[d];
                dayAnchor.addEventListener('click', function(event) {
                    alert("" + event.target.innerHTML + "/" + month + "/" + year);
                });

//                console.log(day.id);
            }
        }
    });

})(jQuery);
