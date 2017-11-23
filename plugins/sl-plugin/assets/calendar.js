(function($) {

    $(document).ready(function() {

        if(window.location.pathname === '/') {
            displayFleet();
        } else if(window.location.pathname === '/agenda') {
            displayVclAgenda();
        }

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

        function displayFleet() {
            var req = new XMLHttpRequest();
            req.open('GET', slCal.siteURL + '/wp-json/slplugin/v1/fleet');
            req.onload = function() {
                if(req.status >= 200 && req.status < 400) {
                    var fleet = JSON.parse(req.responseText);
                    for(var i = 0; i < fleet.length; i++) {
                        var vcl = fleet[i];
                        displayVcl(vcl);
                    }
                } else {
                    alert('Server returned an error');
                }
            };
            req.onerror = function() {
                alert('Connection error');
            };
            req.send();
        }

        function displayVclAgenda() {
            var req = new XMLHttpRequest();
            req.open('GET', slCal.siteURL + '/wp-json/slplugin/v1/agenda/1');
            req.onload = function() {
                if(req.status >= 200 && req.status < 400) {
                    var data = JSON.parse(req.responseText);
                    displayVcl(data);
                } else {
                    alert('Server returned an error');
                }
            };
            req.onerror = function() {
                alert('Connection error');
            };
            req.send();
        }

        function displayVcl(vcl) {
            var vclBody = document.getElementById("page_content");

            var vehicule = document.createElement("div");
            vehicule.setAttribute("class", "vehicule");
            vclBody.appendChild(vehicule);

            var vclInfo = document.createElement("div");
            vehicule.appendChild(vclInfo);
            vclInfo.setAttribute("style", "border: 1px solid; grid-column: 1/4; grid-row: 1/3");

            var vclHeader = document.createElement("h2");
            vclInfo.appendChild(vclHeader);
            var headerText = document.createTextNode(vcl.title);
            vclHeader.appendChild(headerText);

            var imageDiv = document.createElement("div");
            vclInfo.appendChild(imageDiv);
            imageDiv.innerHTML = vcl.thumbnail;
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

