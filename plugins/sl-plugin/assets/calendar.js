(function($) {

    $(document).ready(function() {

        if(window.location.pathname === '/') {
            var date = new Date();
            displayFleet(date.getFullYear(), date.getMonth() + 1);
        }

        var fleet = {
            vclList: [],

            getVcl: function(id) {
                var vcl;
                if(this.vclList.length == 0) {
                    vcl = this.createVcl(id);
                    this.vclList.push(vcl);
                    return vcl;
                }
                for(var i = 0; i < this.vclList.length; i++) {
                    if(this.vclList[i].id == id) {
                        return this.vclList[i];
                    }
                }
                vcl = this.createVcl(id);
                this.vclList.push(vcl);
                return vcl;
            },

            createVcl: function(id) {
                return {
                    id: id,
                    title: null,
                    thumbnail: null,
                    depYear: null,
                    depMonth: null,
                    depDay: null,
                    depHour: null,
                    depMin: null,
                    retYear: null,
                    retMonth: null,
                    retDay: null,
                    retHour: null,
                    retMin: null,
                    agenda: null,

                    depDayTimePicker: null,
                    replaceDepDayTimePicker: function(newDayTimePicker) {
                        this.depDayTimePicker.parentElement.replaceChild(newDayTimePicker, this.depDayTimePicker);
                        this.depDayTimePicker = newDayTimePicker;
                    },

                    clearReturn: function() {
                        var reservation = this.depDayTimePicker.parentElement;
                        var reservationElements = reservation.children;
                        for(var i = 0; i < reservationElements.length; i++) {
                            if(!reservationElements[i].isSameNode(this.depDayTimePicker)) {
                                reservation.removeChild(reservationElements[i]);
                            }
                        }
                    }
                };
            }
        };

        function displayFleet(year, month) {
            var req = new XMLHttpRequest();
            var url = slCal.siteURL + '/wp-json/slplugin/v1/fleet/year=' + year + "/month=" + month;
            req.open('GET', url);
            req.onload = function() {
                if(req.status >= 200 && req.status < 400) {
                    var fleetInfo = JSON.parse(req.responseText);
                    for(var i = 0; i < fleetInfo.length; i++) {
                        var vclInfo = fleetInfo[i];
                        var vcl = fleet.getVcl(vclInfo.id);
                        vcl.title = vclInfo.title;
                        vcl.thumbnail = vclInfo.thumbnail;
                        vcl.depYear = parseInt(vclInfo.agenda.year);
                        vcl.depMonth = parseInt(vclInfo.agenda.month);
                        vcl.depDay = parseInt(vclInfo.agenda.day);
                        vcl.depHour = parseInt(vclInfo.agenda.hour);
                        vcl.depMin = parseInt(vclInfo.agenda.min);
                        vcl.agenda = vclInfo.agenda.days;
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
            vcl.depDayTimePicker = createDiv(reservation);
            replaceDayTimePicker(getDepDayTimePickerRenderer(vcl));
        }

        function refreshDayTimePicker(renderer) {
            var req = new XMLHttpRequest();
            var url = slCal.siteURL + '/wp-json/slplugin/v1/agenda/vcl=' + renderer.vcl.id + "/year=" + renderer.getYear() + "/month=" + renderer.getMonth() + "/day=" + renderer.getDay();
            if(!isNaN(renderer.getHour())) {
                url += '/hour=' + renderer.getHour();
            }
            if(!isNaN(renderer.getMin())) {
                url += '/min=' + renderer.getMin();
            }

            req.open('GET', url);
            req.onload = function() {
                if(req.status >= 200 && req.status < 400) {
                    var data = JSON.parse(req.responseText);
                    replaceDayTimePicker(renderer);
                } else {
                    alert('Server returned an error');
                }
            };
            req.onerror = function() {
                alert('Connection error');
            };
            req.send();
        }

        function getDepDayTimePickerRenderer(vcl) {
            var departDayTimeRenderer = {
                vcl: vcl,
                getYear: function() {
                    return this.vcl.depYear;
                },
                getMonth: function() {
                    return this.vcl.depMonth;
                },
                getDay: function() {
                    return this.vcl.depDay;
                },
                getHour: function() {
                    return this.vcl.depHour;
                },
                getMin: function() {
                    return this.vcl.depMin;
                },
                isPrevMonthAvailable: function() {
                    var curDate = new Date();
                    if(curDate.getFullYear() < this.getYear() || curDate.getMonth() < this.getMonth() - 1) {
                        return true;
                    }
                    return false;
                },
                isNextMonthAvailable: function() {
                    return true;
                },
                getFirstActiveDay: function() {
                    var curDate = new Date();
                    if(curDate.getFullYear() == this.getYear() && curDate.getMonth() == this.getMonth() - 1) {
                        var firstActiveDay = curDate.getDate();
                        if(!isDayAvailable(curDate)) {
                            firstActiveDay++;
                        }
                        return firstActiveDay;
                    }
                    if(curDate.getFullYear() < this.getYear() || curDate.getMonth() < this.getMonth() - 1) {
                        return 1;
                    }
                    return 100;
                },
                newDayElement: function(i) {
                    var dayDiv = document.createElement("div");
                    dayDiv.append(i);
                    if(this.getDay() == i) {
                        dayDiv.setAttribute("class", "selected-clicky");
                    } else {
                        var dayAgenda = getDayAgenda(i, this.vcl.agenda);
                        var dayClass;
                        if(dayAgenda == null) {
                            dayClass = "clicky";
                        } else if(dayAgenda.available) {
                            dayClass = "bordered-clicky";
                        } else {
                            dayClass = "disabled-clicky";
                        }
                        dayDiv.setAttribute("class", dayClass);
                        if(dayAgenda == null || dayAgenda.available) {
                            dayDiv.addEventListener('click', function(event) {
                                departDayTimeRenderer.setDay(event.target.innerHTML);
                            });
                        }
                    }
                    return dayDiv;
                },
                newTimeElement: function(timepicker, hour, mins, prevTimeAdded) {
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
                    if(!this.getDay()) {
                        timeClicky.setAttribute("class", "disabled-clicky");
                        return true;
                    }
                    var dayAgenda = getDayAgenda(this.getDay(), this.vcl.agenda);
                    if(!isTimeAvailable(hour, mins, dayAgenda)) {
                        if(prevTimeAdded) {
                            timeClicky.setAttribute("class", "disabled-clicky");
                        } else {
                            timepicker.removeChild(timeClicky);
                        }
                       return false;
                    }
                    if(hour == this.getHour() && mins == this.getMin()) {
                        timeClicky.setAttribute("class", "selected-clicky");
                        return true;
                    }
                    timeClicky.setAttribute("class", "clicky");
                    timeClicky.addEventListener('click', function(event) {
                        var text = event.target.innerHTML;
                        var colon = text.indexOf(':');
                        departDayTimeRenderer.setTime(text.substring(0, colon), text.substring(colon + 1));
                    });
                    return true;
                },
                replaceDayTimePicker: function(newDayTimePicker) {
                    this.vcl.replaceDepDayTimePicker(newDayTimePicker);
                },
                setMonth: function(year, month) {
                    this.vcl.depYear = parseInt(year);
                    this.vcl.depMonth = parseInt(month);
                    this.vcl.depDay = 0;
                    this.vcl.depHour = NaN;
                    this.vcl.depMin = NaN;
                    this.vcl.clearReturn();
                    refreshDayTimePicker(this);
                },
                setDay: function(day) {
                    this.vcl.depDay = parseInt(day);
                    this.vcl.clearReturn();
                    refreshDayTimePicker(this);
                },
                setTime: function(hour, min) {
                    this.vcl.depHour = parseInt(hour);
                    this.vcl.depMin = parseInt(min);
                    this.vcl.clearReturn();
                    refreshDayTimePicker(this);
                }
            };
            return departDayTimeRenderer;
        }

        var replaceDayTimePicker = function(renderer) {

            var daytimepicker = document.createElement("div");
            daytimepicker.setAttribute("class", "daytimepicker");

            var yearmonth = createDiv(daytimepicker, "yearmonth");
            yearmonth.innerHTML = getSelectedDayTime(renderer);

            var yearMonthArrows = createDiv(daytimepicker, "month-arrows");
            var leftArrow = createDiv(yearMonthArrows, "half-width");
            if(renderer.isPrevMonthAvailable()) {
                createDiv(leftArrow, "left").addEventListener('click', function(event) {
                    var prevYear = renderer.getYear();
                    var prevMonth = renderer.getMonth() - 1;
                    if(prevMonth < 1) {
                        prevYear--;
                        prevMonth = 12;
                    }
                    renderer.setMonth(prevYear, prevMonth);
                });
            } else {
                createDiv(leftArrow, "disabled-left");
            }

            var rightArrow = createDiv(yearMonthArrows, "half-width");
            if(renderer.isNextMonthAvailable()) {
                createDiv(rightArrow, "right").addEventListener('click', function(event) {
                    var nextYear = renderer.getYear();
                    var nextMonth = renderer.getMonth() + 1;
                    if(nextMonth > 12) {
                        nextYear++;
                        nextMonth = 1;
                    }
                    renderer.setMonth(nextYear, nextMonth);
                });
            } else {
                createDiv(rightArrow, "disabled-right");
            }

            var timeArrows = createDiv(daytimepicker, "arrows");
            var upArrow = createDiv(timeArrows, "half-height");
            var timeScrollUp = createDiv(upArrow, "disabled-up");
            var downArrow = createDiv(timeArrows, "half-height");
            var timeScrollDown = createDiv(downArrow, "down");
            var lastScrollTop = 0;

            var firstOfMonth = new Date(renderer.getYear(), renderer.getMonth() - 1, 1);
            var totalDays = daysInMonth(renderer.getYear(), renderer.getMonth() - 1);

            var daypicker = addDayPicker(daytimepicker, firstOfMonth.getDay(), totalDays, renderer);
            renderer.replaceDayTimePicker(daytimepicker);
            var timepicker = addTimePicker(daytimepicker, daypicker.clientHeight, renderer);
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

        function getSelectedDayTime(renderer) {
            var selected = '';
            var day = renderer.getDay();
            if(day && day > 0) {
                if(day <= 9) {
                    selected += '0';
                }
                selected += day + '.';
            } else {
                selected += '__.';
            }
            var month = renderer.getMonth();
            if(month <= 9) {
                selected += '0';
            }
            selected += month + '.' + renderer.getYear() + ' ';
            var hour = renderer.getHour();
            if(hour) {
                if(hour <= 9) {
                    selected += '0';
                }
                selected += hour + ':';
                var min = renderer.getMin();
                if(min <= 9) {
                    selected += '0';
                }
                selected += min;
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

        var addDayPicker = function(daytimepicker, startsOnDay, daysTotal, renderer) {
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
            while(i < renderer.getFirstActiveDay()) {
                createDiv(daypicker, "disabled-clicky").append(i++);
            }
            while(i <= daysTotal) {
                daypicker.appendChild(renderer.newDayElement(i++));
            }
            return daypicker;
        }

        function addTimePicker(daytimepicker, height, renderer) {
            var timepicker = createDiv(daytimepicker, "timepicker");
            if(height > 0) {
                timepicker.style.height = height + 'px';
            }
            var addedTime = false;
            var hour = 8;
            var mins = 0;
            while(hour <= 19) {
                addedTime = renderer.newTimeElement(timepicker, hour, mins, addedTime);
                if(mins == 30) {
                    hour++;
                    mins = 0;
                } else {
                    mins = 30;
                }
            }
            return timepicker;
        }

        var getDayAgenda = function(day, days) {
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
        };

        var isTimeAvailable = function(hour, mins, dayAgenda) {
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
        };

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

