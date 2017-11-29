(function($) {

    $(document).ready(function() {

        if(window.location.pathname === '/') {
            var date = new Date();
            displayFleet(date.getFullYear(), date.getMonth() + 1, date.getDate());
        } else if(window.location.pathname === '/agenda') {
            displayVclAgenda();
        }

        function displayFleet(year, month, day) {
            var req = new XMLHttpRequest();
            req.open('GET', slCal.siteURL + '/wp-json/slplugin/v1/fleet/year=' + year + "/month=" + month + "/day=" + day);
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

        function displayVclAgenda(vcl, year, month, day, calendar) {
            var req = new XMLHttpRequest();
            req.open('GET', slCal.siteURL + '/wp-json/slplugin/v1/agenda/vcl=' + vcl + "/year=" + year + "/month=" + month + "/day=" + day);
            req.onload = function() {
                if(req.status >= 200 && req.status < 400) {
                    var data = JSON.parse(req.responseText);
                    var newCalendar = displayCalendar(data);
                    var calContainer = calendar.parentElement;
                    calContainer.removeChild(calendar);
                    calContainer.appendChild(newCalendar);
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
            vclInfo.setAttribute("style", "border: 1px solid; grid-column: 1/4; grid-row: 1/3");

            createHeader(vclInfo, 2, vcl.title);
            createDiv(vclInfo).innerHTML = vcl.thumbnail;

            var calContainer = createDiv(vehicule);
            calContainer.setAttribute("id", "calContainer" + vcl.id);
            calContainer.setAttribute("style", "border: 1px solid");
            createHeader(calContainer, 2, "Depart");
            calContainer.appendChild(displayCalendar(vcl.agenda));
        }

        var displayCalendar = function(agenda) {

            var calendar = document.createElement("div");
            calendar.setAttribute("class", "calendar");

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
/*
            var form = createForm(calendar);
            var formYear = addFormInput(form, "calYear", agenda.year);
            var formMonth = addFormInput(form, "calMonth", agenda.month);
            var formDay = addFormInput(form, "calDay", agenda.day);
*/
            var month = createDiv(calendar, "month");
            var monthUl = createUl(month);
            var prevMonthLi;
            if(enablePrevMonth) {
                prevMonthLi = createLi(monthUl, "arrow");
                var a = createAnchor(prevMonthLi, "#", "&#10094;");
                a.setAttribute("onclick", "return false;");
                a.addEventListener('click', function(event) {
                    var prevYear = agenda.year;
                    var prevMonth = parseInt(agenda.month) - 1;
                    if(prevMonth < 1) {
                        prevYear--;
                        prevMonth = 12;
                    }
                    displayVclAgenda(agenda.vcl, prevYear, prevMonth, 1, calendar);
                });

            } else {
                prevMonthLi = createLi(monthUl, "arrow disabled").innerHTML = "&#10094;";
            }
            var monthLi = createLi(monthUl);
            monthLi.innerHTML = agenda.month + ", " + agenda.year;
            var nextMonthLi = createLi(monthUl, "arrow");
            var nextMonthAnchor = createAnchor(nextMonthLi, "#", "&#10095;");
            nextMonthAnchor.setAttribute("onclick", "return false;");
            nextMonthAnchor.addEventListener('click', function(event) {
                var nextYear = agenda.year;
                var nextMonth = parseInt(agenda.month) + 1;
                if(nextMonth > 12) {
                    nextYear++;
                    nextMonth = 1;
                }
                displayVclAgenda(agenda.vcl, nextYear, nextMonth, 1, calendar);
            });

            var weekDaysUl = createUl(calendar, "weekdays");
            createLi(weekDaysUl).innerHTML = "Lu";
            createLi(weekDaysUl).innerHTML = "Ma";
            createLi(weekDaysUl).innerHTML = "Me";
            createLi(weekDaysUl).innerHTML = "Je";
            createLi(weekDaysUl).innerHTML = "Ve";
            createLi(weekDaysUl).innerHTML = "Sa";
            createLi(weekDaysUl).innerHTML = "Di";

            var daysUl = createUl(calendar, "days");

            var firstOfMonth = new Date(agenda.year, agenda.month - 1, 1);

            for(var i = 1; i < firstOfMonth.getDay(); i++) {
                createLi(daysUl, "blank");
            }
            var daysTotal = daysInMonth(agenda.year, agenda.month - 1);
            var iDay = 1;
            while(iDay < firstActiveDay && iDay < daysTotal) {
                createLi(daysUl, "day-past").innerHTML = iDay++;
            }
            while(iDay <= daysTotal) {
                if(agenda.day == iDay) {
                    var dayLi = createLi(daysUl, "day-picked");
                    dayLi.innerHTML = iDay;
                } else {
                    var dayClass;
                    var dayAgenda = getDayAgenda(agenda.days, iDay);
                    var dayClass;
                    if(dayAgenda === null) {
                        dayClass = "day-av";
                    } else if(dayAgenda.available) {
                        dayClass = "day-pav";
                    } else {
                        dayClass = "day-na";
                    }
                    var dayLi = createLi(daysUl, dayClass);
                    if(dayAgenda === null || dayAgenda.available) {
                        var dayAnchor = createAnchor(dayLi, "#", iDay);
                        dayAnchor.setAttribute("onclick", "return false;");
                        dayAnchor.addEventListener('click', function(event) {
                            displayVclAgenda(agenda.vcl, agenda.year, agenda.month, event.target.innerHTML, calendar);
                        });
                    } else {
                        dayLi.innerHTML = iDay;
                    }
                }
                iDay++;
            }
            return calendar;
        }

        var addFormInput = function(form, name, value) {
            var arg = document.createElement("INPUT");
            form.appendChild(arg);
            arg.setAttribute("type", "hidden");
            arg.setAttribute("name", name);
            arg.setAttribute("value", value);
            return arg;
        };

        var setFormInput = function(input, value) {
            input.setAttribute("value", value);
        }

        var submitForm = function(form, action, method) {
            form.setAttribute("action", action);
            form.setAttribute("method", method);
            form.submit();
        };

        var createAnchor = function(parent, href, text, cssClass) {
            var a = createChild(parent, "a", cssClass);
            a.setAttribute("href", href);
            a.innerHTML = text;
            return a;
        }

        var createHeader = function(parent, h, text, cssClass) {
            var header = createChild(parent, "h" + h, cssClass);
            header.innerHTML = text;
            return header;
        }

        var createLi = function(parent, cssClass) {
            return createChild(parent, "li", cssClass);
        }

        var createUl = function(parent, cssClass) {
            return createChild(parent, "ul", cssClass);
        }

        var createForm = function(parent) {
            return createChild(parent, "form");
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

