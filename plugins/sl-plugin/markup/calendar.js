$(function() {

    var body = $("body");
    addDayTimePicker(body, 5, 31);

    function addDayTimePicker(parent, startsOnDay, totalDays) {
        var daytimepicker = createDiv(parent, "daytimepicker");

        var yearmonth = createDiv(daytimepicker, "yearmonth");
        yearmonth.innerHTML = "Decembre 2017";

        var yearMonthArrows = createDiv(daytimepicker, "arrows");
        var leftArrow = createDiv(yearMonthArrows, "half-width");
        createDiv(leftArrow, "disabled-left");
        var rightArrow = createDiv(yearMonthArrows, "half-width");
        createDiv(rightArrow, "right");

        var timeArrows = createDiv(daytimepicker, "arrows");
        var upArrow = createDiv(timeArrows, "half-height");
        createDiv(upArrow, "disabled-up");
        var downArrow = createDiv(timeArrows, "half-height");
        createDiv(downArrow, "down");

        var daypicker = addDayPicker(daytimepicker, startsOnDay, totalDays);
        addTimePicker(daytimepicker, daypicker.clientHeight);
    }

    function addDayPicker(daytimepicker, startsOnDay, totalDays) {
        var daypicker = createDiv(daytimepicker, "daypicker");
        createDiv(daypicker, "day-name").append('Lu');
        createDiv(daypicker, "day-name").append('Ma');
        createDiv(daypicker, "day-name").append('Me');
        createDiv(daypicker, "day-name").append('Je');
        createDiv(daypicker, "day-name").append('Ve');
        createDiv(daypicker, "day-name").append('Sa');
        createDiv(daypicker, "day-name").append('Di');
        for(var i = 0; i < startsOnDay; i++) {
            createDiv(daypicker, "clicky-ph");
        }
        var agenda = [{day:3, class:"disabled-clicky"},
                      {day:4, class:"bordered-clicky"},
                      {day:5, class:"disabled-clicky"},
                      {day:11, class:"bordered-clicky"},
                      {day:12, class:"bordered-clicky"},
                      {day:13, class:"bordered-clicky"},
                      {day:28, class:"disabled-clicky"}];
        for(var i = 1; i <= totalDays; i++) {
            var dayClass = getDayClass(i, agenda, "clicky");
            createDiv(daypicker, dayClass).append(i);
        }
        return daypicker;
    }

    function addTimePicker(daytimepicker, height) {
        var timepicker = createDiv(daytimepicker, "timepicker");
        timepicker.style.height = height + 'px';
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
        for(var i = 0; i < agenda.length; i++) {
            var dayAgenda = agenda[i];
            if(day < dayAgenda.day) {
                return defClass;
            }
            if(day === dayAgenda.day) {
                return dayAgenda.class;
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

    function createDiv(parent, cssClass) {
        return createChild(parent, "div", cssClass);
    }

    function createChild(parent, tag, cssClass) {
        var child = document.createElement(tag);
        if(cssClass === undefined) {
            parent.append(child);
            return child;
        }
        child.setAttribute("class", cssClass);
        parent.append(child);
        return child;
    }
});
