(function($) {

    $(document).ready(function() {

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
            var form = createForm();
            var calendar = monthArrow.parentElement.parentElement.parentElement.parentElement;
            addCalendarArgs(calendar, form);
            addFormInput(form, 'cal_month_change', action);
            submitForm(form, "/", "post");
        };

        var handleDayClick = function(day) {
            var form = createForm();
            addCalendarArgs(day.parentElement.parentElement.parentElement, form);
            addFormInput(form, 'cal_day', event.target.innerHTML);
            submitForm(form, "/agenda", "post");
        };

        var addCalendarArgs = function(calendar, form) {
            var argsDiv = calendar.getElementsByClassName("args")[0];
            var argDivs = argsDiv.getElementsByClassName("arg");
            var i;
            for(i = 0; i < argDivs.length; i++) {
                var argDiv = argDivs[i];
                addFormInput(form, argDiv.getElementsByClassName("arg-name")[0].innerHTML, argDiv.getElementsByClassName("arg-value")[0].innerHTML);
            }
        };

        var createForm = function() {
            var form = document.createElement("FORM");
            document.body.appendChild(form);
            return form;
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
