(function($) {

    $(document).ready(function() {

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

                    var form = createForm();

                    var argsDiv = calendar.getElementsByClassName("args")[0];
                    var argDivs = argsDiv.getElementsByClassName("arg");
                    var i;
                    for(i = 0; i < argDivs.length; i++) {
                        var argDiv = argDivs[i];
                        addFormInput(form, argDiv.getElementsByClassName("arg-name")[0].innerHTML, argDiv.getElementsByClassName("arg-value")[0].innerHTML);

                    }
                    addFormInput(form, 'cal_day', event.target.innerHTML);

                    submitForm(form, "/agenda", "post");
                });
            }
        }
    });

})(jQuery);
