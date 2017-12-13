(function($) {

    $(document).ready(function() {

        if(window.location.pathname === '/') {
            var date = new Date();
            displayFleet(date.getFullYear(), date.getMonth() + 1);
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

        function displayVcl(vcl) {
            var vclBody = document.getElementById("page_content");

            var vehicule = createDiv(vclBody, "vehicule");

            var vclInfo = createDiv(vehicule);
            vclInfo.setAttribute("style", "border: 1px none; grid-row: 1/3;");

            createHeader(vclInfo, 2, vcl.title);
            createDiv(vclInfo).innerHTML = vcl.thumbnail;

            var reservation = createDiv(vehicule);
            reservation.setAttribute("id", "reservation" + vcl.id);
            reservation.setAttribute("style", "border: 1px none");
            replaceDayTimePicker(createDiv(reservation), vcl.agenda);
        }

        function refreshDayTimePicker(daytimepicker, vcl, year, month, day, hour, mins) {
            var req = new XMLHttpRequest();
            var url = slCal.siteURL + '/wp-json/slplugin/v1/agenda/vcl=' + vcl + "/year=" + year + "/month=" + month + "/day=" + day;
            if(hour != null) {
                url += '/hour=' + hour;
            }
            if(mins != null) {
                url += '/min=' + mins;
            }

            req.open('GET', url);
            req.onload = function() {
                if(req.status >= 200 && req.status < 400) {
                    var data = JSON.parse(req.responseText);
                    replaceDayTimePicker(daytimepicker, data);
                } else {
                    alert('Server returned an error');
                }
            };
            req.onerror = function() {
                alert('Connection error');
            };
            req.send();
        }

        function setDepartureMonth(daytimepicker, vcl, year, month) {
            clearReservation(daytimepicker.parentElement, daytimepicker);
            refreshDayTimePicker(daytimepicker, vcl, year, month, 0);
        }

        function setDepartureDay(daytimepicker, vcl, year, month, day) {
            clearReservation(daytimepicker.parentElement, daytimepicker);
            refreshDayTimePicker(daytimepicker, vcl, year, month, day);
        }

        function clearReservation(reservation, except) {
            var reservationElements = reservation.children;
            for(var i = 0; i < reservationElements.length; i++) {
                if(!reservationElements[i].isSameNode(except)) {
                    reservation.removeChild(reservationElements[i]);
                }
            }
        }

        function setDepartureTime(daytimepicker, agenda, hour, mins) {
            var returnPh = daytimepicker.parentElement.appendChild(document.createElement("div"));
            refreshDayTimePicker(daytimepicker, agenda.vcl, agenda.year, agenda.month, agenda.day, hour, mins);
            replaceDayTimePicker(returnPh, agenda);
        }

        var replaceDayTimePicker = function(ph, agenda) {

            var daytimepicker = document.createElement("div");
            daytimepicker.setAttribute("class", "daytimepicker");

            var yearmonth = createDiv(daytimepicker, "yearmonth");
            yearmonth.innerHTML = getSelectedDayTime(agenda);

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

            var yearMonthArrows = createDiv(daytimepicker, "month-arrows");
            var leftArrow = createDiv(yearMonthArrows, "half-width");
            if(enablePrevMonth) {
                createDiv(leftArrow, "left").addEventListener('click', function(event) {
                    var prevYear = agenda.year;
                    var prevMonth = parseInt(agenda.month) - 1;
                    if(prevMonth < 1) {
                        prevYear--;
                        prevMonth = 12;
                    }
                    setDepartureMonth(getParent(event.target, 3), agenda.vcl, prevYear, prevMonth);
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
                setDepartureMonth(getParent(event.target, 3), agenda.vcl, nextYear, nextMonth);
            });

            var timeArrows = createDiv(daytimepicker, "arrows");
            var upArrow = createDiv(timeArrows, "half-height");
            var timeScrollUp = createDiv(upArrow, "disabled-up");
            var downArrow = createDiv(timeArrows, "half-height");
            var timeScrollDown = createDiv(downArrow, "down");
            var lastScrollTop = 0;

            var firstOfMonth = new Date(agenda.year, agenda.month - 1, 1);
            var daysTotal = daysInMonth(agenda.year, agenda.month - 1);

            var daypicker = addDayPicker(daytimepicker, firstOfMonth.getDay(), firstActiveDay, daysTotal, agenda);
            ph.parentElement.replaceChild(daytimepicker, ph);
            var timepicker = addTimePicker(daytimepicker, daypicker.clientHeight, agenda, getDayAgenda(parseInt(agenda.day), agenda.days));
            timepicker.addEventListener('scroll', function(event) {
                if(timepicker.scrollTop == 0) {
                    upArrow.removeChild(timeScrollUp);
                    timeScrollUp = createDiv(upArrow, "disabled-up");
                } else if(timepicker.scrollTop == timepicker.scrollHeight - timepicker.clientHeight) {
                    downArrow.removeChild(timeScrollDown);
                    timeScrollDown = createDiv(downArrow, "disabled-down");
                } else if(lastScrollTop == 0) {
                    upArrow.removeChild(timeScrollUp);
                    timeScrollUp = createDiv(upArrow, "up");
                    timeScrollUp.addEventListener('click', function(event) {
                        timepicker.scrollTop = timepicker.scrollTop - 20;
                        clearSelection();
                    });
                } else if(lastScrollTop == timepicker.scrollHeight - timepicker.clientHeight) {
                    downArrow.removeChild(timeScrollDown);
                    timeScrollDown = createDiv(downArrow, "down");
                    timeScrollDown.addEventListener('click', function(event) {
                        timepicker.scrollTop = timepicker.scrollTop + 20;
                        clearSelection();
                    });
                }
                lastScrollTop = timepicker.scrollTop;
            });
            timeScrollDown.addEventListener('click', function(event) {
                timepicker.scrollTop = timepicker.scrollTop + 20;
                clearSelection();
            });
        }

        function getSelectedDayTime(agenda) {
            var selected = '';
            if(agenda.day != null && agenda.day > 0) {
                if(agenda.day <= 9) {
                    selected += '0';
                }
                selected += agenda.day + '.';
            } else {
                selected += '__.';
            }
            if(agenda.month <= 9) {
                selected += '0';
            }
            selected += agenda.month + '.' + agenda.year + ' ';
            if(agenda.hour != null) {
                if(agenda.hour <= 9) {
                    selected += '0';
                }
                selected += agenda.hour + ':';
                if(agenda.min <= 9) {
                    selected += '0';
                }
                selected += agenda.min;
            } else {
                selected += '__:__';
            }
            return selected;
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
                    var dayAgenda = getDayAgenda(i, agenda.days);
                    var dayClass;
                    if(dayAgenda == null) {
                        dayClass = "clicky";
                    } else if(dayAgenda.available) {
                        dayClass = "bordered-clicky";
                    } else {
                        dayClass = "disabled-clicky";
                    }
                    dayDiv = createDiv(daypicker, dayClass);
                    if(dayAgenda == null || dayAgenda.available) {
                        dayDiv.addEventListener('click', function(event) {
                            setDepartureDay(getParent(event.target, 2), agenda.vcl, agenda.year, agenda.month, event.target.innerHTML);
                        });
                    }
                }
                dayDiv.append(i++);
            }
            return daypicker;
        }

        function addTimePicker(daytimepicker, height, agenda, dayAgenda) {
            var timepicker = createDiv(daytimepicker, "timepicker");
            if(height > 0) {
                timepicker.style.height = height + 'px';
            }
            var addedTime = false;
            var hour = 8;
            var mins = 0;
            while(hour <= 19) {
                addedTime = addTime(timepicker, agenda, dayAgenda, hour, mins, addedTime);
                if(mins == 30) {
                    hour++;
                    mins = 0;
                } else {
                    mins = 30;
                }
            }

            return timepicker;
        }

        addTime = function(timepicker, agenda, dayAgenda, hour, mins, prevTimeAdded) {
            var timeClicky = createDiv(timepicker);
            var text = '';
            if(hour < 10) {
                text += '0';
            }
            text += hour + ':' + mins;
            if(mins == 0) {
                text += '0';
            }
            timeClicky.append(text);
            if(agenda.day == null || agenda.day == 0) {
                timeClicky.setAttribute("class", "disabled-clicky");
                return true;
            }
            if(!isTimeAvailable(hour, mins, dayAgenda)) {
                if(prevTimeAdded) {
                    timeClicky.setAttribute("class", "disabled-clicky");
                } else {
                    timepicker.removeChild(timeClicky);
                }
                return false;
            }
            if(hour == agenda.hour && mins == agenda.min) {
                timeClicky.setAttribute("class", "selected-clicky");
                return true;
            }
            timeClicky.setAttribute("class", "clicky");
            timeClicky.addEventListener('click', function(event) {
                var text = event.target.innerHTML;
                var colon = text.indexOf(':');
                setDepartureTime(getParent(event.target, 2), agenda, parseInt(text.substring(0, colon)), parseInt(text.substring(colon + 1)));
            });
            return true;
        }

        getDayAgenda = function(day, days) {
            for(var i = 0; i < days.length; i++) {
                var dayAgenda = days[i];
                if(day < dayAgenda.day) {
                    return null;
                }
                if(day === dayAgenda.day) {
                    return dayAgenda;
                }
            }
            return null;
        }

        isTimeAvailable = function(hour, mins, dayAgenda) {
            if(dayAgenda == null) {
                return true;
            }
            var time = hour;
            if(mins == 30) {
                time += 0.5;
            }
            var bookings = dayAgenda.bookings;
            for(var i = 0; i < bookings.length; i += 2) {
                var bookingStart = bookings[i];
                if(time < bookingStart) {
                    return true;
                }
                if(time === bookingStart) {
                    return false;
                }
                if(time < bookingStart + bookings[i+1]) {
                    return false;
                }
            }
            return true;
        }

        function getParent(element, level) {
            var parent = element.parentElement;
            for(var i = 1; i < level; ++i) {
                parent = parent.parentElement;
            }
            return parent;
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

        var isDayAvailable = function(date) {
            return 12*60 - date.getHours()*60 - date.getMinutes() > 120;
        }

        var daysInMonth = function(year, month) {
            return 32 - new Date(year, month, 32).getDate();
        }

        function clearSelection() {
            if(document.selection && document.selection.empty) {
                document.selection.empty();
            } else if(window.getSelection) {
                var sel = window.getSelection();
                sel.removeAllRanges();
            }
        }
    });

})(jQuery);

