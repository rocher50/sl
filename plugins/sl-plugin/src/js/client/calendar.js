function createHeader(parent, h, text, cssClass) {
    var header = createChild(parent, "h" + h, cssClass);
    header.innerHTML = text;
    return header;
}

function createInput(parent, id) {
    var input = createChild(parent, "input");
    input.setAttribute('id', id);
    input.setAttribute('name', id);
    return input;
}

function createDiv(parent, cssClass) {
    return createChild(parent, "div", cssClass);
}

function createChild(parent, tag, cssClass) {
    var child = document.createElement(tag);
    if(cssClass === undefined) {
        parent.appendChild(child);
        return child;
    }
    child.setAttribute("class", cssClass);
    parent.appendChild(child);
    return child;
}

function clearSelection() {
    if(document.selection && document.selection.empty) {
        document.selection.empty();
    } else if(window.getSelection) {
        var sel = window.getSelection();
        sel.removeAllRanges();
    }
}

//(function($) {

//    $(document).ready(function() {

        var replaceDayTimePicker = function(renderer) {

            var daytimepicker = document.createElement("div");
            daytimepicker.setAttribute("class", "daytimepicker");

            var yearmonth = createDiv(daytimepicker, "yearmonth");
            yearmonth.innerHTML = renderer.getMonthName() + ' ' + renderer.year;

            var yearMonthArrows = createDiv(daytimepicker, "month-arrows");
            var leftArrow = createDiv(yearMonthArrows, "half-width");
            if(renderer.isPrevMonthAvailable()) {
                createDiv(leftArrow, "left").addEventListener('click', function(event) {
                    var prevYear = renderer.year;
                    var prevMonth = renderer.month - 1;
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
                    var nextYear = renderer.year;
                    var nextMonth = renderer.month + 1;
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

            var firstOfMonth = new Date(renderer.year, renderer.month - 1, 1);
            var totalDays = daysInMonth(renderer.year, renderer.month - 1);

            var daypicker = addDayPicker(daytimepicker, firstOfMonth.getDay(), totalDays, renderer);
            renderer.replaceDayTimePicker(daytimepicker);
            var timepicker = addTimePicker(daytimepicker, daypicker.clientHeight - 2*daypicker.clientHeight/100, renderer);
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

        var addDayPicker = function(daytimepicker, startsOnDay, daysTotal, renderer) {
            var daypicker = createDiv(daytimepicker, "daypicker");
            var weekDays = renderer.getDayNames();
            for(var i = 0; i < weekDays.length; i++) {
                createDiv(daypicker, "day-name").append(weekDays[i]);
            }
            for(var i = 1; i < startsOnDay; i++) {
                createDiv(daypicker, "clicky-ph");
            }
            var i = 1;
            var firstActiveDay = renderer.getFirstActiveDay();
            while(i < firstActiveDay) {
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
            var hour = renderer.getFirstWorkingHour();
            var mins = renderer.getFirstWorkingHourMin();
            var firstActiveHour = renderer.getFirstActiveHour();
            if(hour < firstActiveHour) {
                mins = 0;
            }
            while(hour < firstActiveHour) {
                hour++;
            }
            while(hour < renderer.getLastWorkingHour() ||
                  hour == renderer.getLastWorkingHour() && mins <= renderer.getLastWorkingHourMin()) {
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

        var daysInMonth = function(year, month) {
            return 32 - new Date(year, month, 32).getDate();
        }

//    });
//})(jQuery);

