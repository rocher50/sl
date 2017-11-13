(function($) {

    $(document).ready(function() {
        var calendars = document.getElementsByClassName("calendar");
        var c;
        for(c = 0; c < calendars.length; c++) {
            var calendar = calendars[c];

            var days = calendars[c].getElementsByClassName("days")[0];
            var anchors = days.getElementsByTagName("a");
            var d;
            for(d = 0; d < anchors.length; d++) {
                var dayAnchor = anchors[d];
                dayAnchor.addEventListener('click', function(event) {
                    var calendar = event.target.parentElement.parentElement.parentElement;

                    var args = [];
                    var argsDiv = calendar.getElementsByClassName("args")[0];
                    var argDivs = argsDiv.getElementsByClassName("arg");
                    var i;
                    for(i = 0; i < argDivs.length; i++) {
                        var argDiv = argDivs[i];
                        args.push(argDiv.getElementsByClassName("arg-name")[0].innerHTML);
                        args.push(argDiv.getElementsByClassName("arg-value")[0].innerHTML);
                    }

                    var msg = "day=" + event.target.innerHTML;
                    var i = 0;
                    while(i < args.length) {
                        msg += ", " + args[i] + "=" + args[i + 1];
                        i += 2;
                    }

                    alert(msg);
                });
            }
        }
    });

})(jQuery);
