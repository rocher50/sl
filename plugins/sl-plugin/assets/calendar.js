(function($) {

    $(document).ready(function() {
/*
        var req = new XMLHttpRequest();
        req.open('GET', slCal.siteURL + '/wp-json/slplugin/v1/agenda/1');
        req.onload = function() {
            if(req.status >= 200 && req.status < 400) {
                var data = JSON.parse(req.responseText);
                alert('recevied data ' + data);
            } else {
                alert('Server returned an error');
            }
        };
        req.onerror = function() {
            alert('Connection error');
        };
        req.send();
*/
        var calendars = document.getElementsByClassName("calendar");
        var c;
        for(c = 0; c < calendars.length; c++) {
            var calendar = calendars[c];
            var i;

            // add month prev/next event listeners
            var monthDiv = calendar.getElementsByClassName("month")[0];
            var anchors = monthDiv.getElementsByTagName("a");
            for(i = 0; i < anchors.length; i++) {
                var anchor = anchors[i];
                if(anchor.innerHTML.charCodeAt(0) == 10095) {
                    anchor.addEventListener('click', function(event) {
                        handleMonthClick(event.target, 1);
                    });
                } else if(anchor.innerHTML.charCodeAt(0) == 10094) {
                    anchor.addEventListener('click', function(event) {
                        handleMonthClick(event.target, -1);
                    });
                }
            }

            // add day event listeners
            var days = calendar.getElementsByClassName("days")[0];
            anchors = days.getElementsByTagName("a");
            var i;
            for(i = 0; i < anchors.length; i++) {
                var dayAnchor = anchors[i];
                dayAnchor.addEventListener('click', function(event) {
                    handleDayClick(event.target);
                });
            }
        }

        var handleMonthClick = function(monthArrow, action) {
            var calendar = monthArrow.parentElement.parentElement.parentElement.parentElement;
            var form = calendar.getElementsByTagName('form')[0];
            addFormInput(form, 'cal_month_change', action);
            submitForm(form, "/agenda", "post");
        };

        var handleDayClick = function(day) {
            var calendar = day.parentElement.parentElement.parentElement
            var form = calendar.getElementsByTagName('form')[0];
            addFormInput(form, 'cal_day', event.target.innerHTML);
            submitForm(form, "/agenda", "post");
        };

        var addFormInput = function(form, name, value) {
            var arg = document.createElement("INPUT");
            arg.setAttribute("type", "hidden");
            arg.setAttribute("name", name);
            arg.setAttribute("value", value);
            form.appendChild(arg);
        };

        var submitForm = function(form, action, method) {
            form.setAttribute("action", action);
            form.setAttribute("method", method);
            form.submit();
        };
    });

})(jQuery);
