(function($) {

    $(document).ready(function() {

        if(window.location.pathname === '/') {
            var date = new Date();
            displayFleet(date.getFullYear(), date.getMonth() + 1);
        } else if(window.location.pathname === '/agenda') {
            displayVclAgenda();
        }

        function displayFleet(year, month) {
            var req = new XMLHttpRequest();
            var url = slCal.siteURL + '/wp-json/slplugin/v1/fleet/year=' + year + "/month=" + month;
            req.open('GET', url);
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

        function displayVclAgenda(vcl, year, month, day, daytimepicker) {
            var req = new XMLHttpRequest();
            req.open('GET', slCal.siteURL + '/wp-json/slplugin/v1/agenda/vcl=' + vcl + "/year=" + year + "/month=" + month + "/day=" + day);
            req.onload = function() {
                if(req.status >= 200 && req.status < 400) {
                    var data = JSON.parse(req.responseText);
                    var container = daytimepicker.parentElement;
                    container.removeChild(daytimepicker);
                    var newDtPicker = addDayTimePicker(container, data);
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

            var vehicule = createDiv(vclBody, "vehicule");

            var vclInfo = createDiv(vehicule);
            vclInfo.setAttribute("style", "border: 1px none;");

            createHeader(vclInfo, 2, vcl.title);
            createDiv(vclInfo).innerHTML = vcl.thumbnail;

            var dtPickerContainer = createDiv(vehicule);
            dtPickerContainer.setAttribute("id", "calContainer" + vcl.id);
            dtPickerContainer.setAttribute("style", "border: 1px none");
            addDayTimePicker(dtPickerContainer, vcl.agenda);
        }

        var addDayTimePicker = function(container, agenda) {

            var daytimepicker = document.createElement("div");
            daytimepicker.setAttribute("class", "daytimepicker");

            var yearmonth = createDiv(daytimepicker, "yearmonth");
            yearmonth.innerHTML = agenda.month + ' ' + agenda.year;

            var agendaDate = new Date(agenda.year, agenda.month - 1, agenda.day);
            var curDate = new Date();
            var firstActiveDay;
            var enablePrevMonth = false;
            if(curDate.getFullYear() == agenda.year && curDate.getMonth() == agenda.month - 1) {
                firstActiveDay = curDate.getDate();
                if(!isDayAvailable(curDate)) {
                    firstActiveDay++;
                }
            } else if(curDate.getFullYear() < agenda.year || curDate.getMonth() < agenda.month - 1) {
                firstActiveDay = 1;
                enablePrevMonth = true;
            }

            var yearMonthArrows = createDiv(daytimepicker, "arrows");
            var leftArrow = createDiv(yearMonthArrows, "half-width");
            if(enablePrevMonth) {
                createDiv(leftArrow, "left").addEventListener('click', function(event) {
                    var prevYear = agenda.year;
                    var prevMonth = parseInt(agenda.month) - 1;
                    if(prevMonth < 1) {
                        prevYear--;
                        prevMonth = 12;
                    }
                    displayVclAgenda(agenda.vcl, prevYear, prevMonth, 0, daytimepicker);
                });
            } else {
                createDiv(leftArrow, "disabled-left");
            }

            var rightArrow = createDiv(yearMonthArrows, "half-width");
            createDiv(rightArrow, "right").addEventListener('click', function(event) {
                var nextYear = agenda.year;
                var nextMonth = parseInt(agenda.month) + 1;
                if(nextMonth > 12) {
                    nextYear++;
                    nextMonth = 1;
                }
                displayVclAgenda(agenda.vcl, nextYear, nextMonth, 0, daytimepicker);
            });

            var timeArrows = createDiv(daytimepicker, "arrows");
            var upArrow = createDiv(timeArrows, "half-height");
            createDiv(upArrow, "disabled-up");
            var downArrow = createDiv(timeArrows, "half-height");
            createDiv(downArrow, "down");

            var firstOfMonth = new Date(agenda.year, agenda.month - 1, 1);
            var daysTotal = daysInMonth(agenda.year, agenda.month - 1);

            var daypicker = addDayPicker(daytimepicker, firstOfMonth.getDay(), firstActiveDay, daysTotal, agenda);
            container.appendChild(daytimepicker);
            addTimePicker(daytimepicker, daypicker.clientHeight);
            return daytimepicker;
        }

        var createHeader = function(parent, h, text, cssClass) {
            var header = createChild(parent, "h" + h, cssClass);
            header.innerHTML = text;
            return header;
        }

        var addDayPicker = function(daytimepicker, startsOnDay, firstActiveDay, totalDays, agenda) {
            var daypicker = createDiv(daytimepicker, "daypicker");
            createDiv(daypicker, "day-name").append('Lu');
            createDiv(daypicker, "day-name").append('Ma');
            createDiv(daypicker, "day-name").append('Me');
            createDiv(daypicker, "day-name").append('Je');
            createDiv(daypicker, "day-name").append('Ve');
            createDiv(daypicker, "day-name").append('Sa');
            createDiv(daypicker, "day-name").append('Di');
            for(var i = 1; i < startsOnDay; i++) {
                createDiv(daypicker, "clicky-ph");
            }
            var i = 1;
            while(i < firstActiveDay) {
                createDiv(daypicker, "disabled-clicky").append(i++);
            }

            while(i <= totalDays) {
                var dayDiv;
                if(agenda.day == i) {
                    dayDiv = createDiv(daypicker, "selected-clicky");
                } else {
                    var dayClass = getDayClass(i, agenda, "clicky");
                    dayDiv = createDiv(daypicker, dayClass);
                    dayDiv.addEventListener('click', function(event) {
                        displayVclAgenda(agenda.vcl, agenda.year, agenda.month, event.target.innerHTML, daytimepicker);
                    });
                }
                dayDiv.append(i++);
            }
            return daypicker;
        }

    function addTimePicker(daytimepicker, height) {
        var timepicker = createDiv(daytimepicker, "timepicker");
        if(height > 0) {
            timepicker.style.height = height + 'px';
        }
        var agenda = [{hour:9, min:30, class:"disabled-clicky"},
                      {hour:11, min:0, class:"bordered-clicky"},
                      {hour:11, min:30, class:"disabled-clicky"},
                      {hour:13, min:0, class:"bordered-clicky"},
                      {hour:13, min:30, class:"bordered-clicky"},
                      {hour:14, min:0, class:"bordered-clicky"},
                      {hour:16, min:30, class:"disabled-clicky"}];
        for(var i = 8; i <= 19; i++) {
            createDiv(timepicker, getTimeClass(i, 0, agenda, "clicky")).append(i + ':00');
            createDiv(timepicker, getTimeClass(i, 30, agenda, "clicky")).append(i + ':30');
        }
        return timepicker;
    }

    function getDayClass(day, agenda, defClass) {
        for(var i = 0; i < agenda.days.length; i++) {
            var dayAgenda = agenda.days[i];
            if(day < dayAgenda.day) {
                return defClass;
            }
            if(day === dayAgenda.day) {
                if(dayAgenda.available) {
                    return "bordered-clicky";
                }
                return "disabled-clicky";
            }
        }
        return defClass;
    }

    function getTimeClass(hour, min, agenda, defClass) {
        for(var i = 0; i < agenda.length; i++) {
            var timeAgenda = agenda[i];
            if(hour < timeAgenda.hour) {
                return defClass;
            }
            if(hour === timeAgenda.hour) {
                if(min < timeAgenda.min) {
                    return defClass;
                }
                if(min === timeAgenda.min) {
                    return timeAgenda.class;
                }
            }
        }
        return defClass;
    }

        var createDiv = function(parent, cssClass) {
            return createChild(parent, "div", cssClass);
        }

        var createChild = function(parent, tag, cssClass) {
            var child = document.createElement(tag);
            if(cssClass === undefined) {
                parent.appendChild(child);
                return child;
            }
            child.setAttribute("class", cssClass);
            parent.appendChild(child);
            return child;
        }

        var getDayAgenda = function(agenda, iDay) {
            for(var i = 0; i < agenda.length; i++) {
                var dayAgenda = agenda[i];
                if(iDay === dayAgenda.day) {
                    return dayAgenda;
                } if(iDay < dayAgenda.day) {
                    return null;
                }
            }
            return null;
        }

        var isDayAvailable = function(date) {
            return 12*60 - date.getHours()*60 - date.getMinutes() > 120;
        }

        var daysInMonth = function(year, month) {
            return 32 - new Date(year, month, 32).getDate();
        }
    });

})(jQuery);

