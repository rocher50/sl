(function($) {

  $(document).ready(function() {

    if(window.location.pathname === '/') {
        var date = new Date();
        displayFleet(date.getFullYear(), date.getMonth() + 1);
    }

    var voc = {
        'months': ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
        'weekDays': ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'],
        'labelDepart': 'Départ',
        'labelReturn': 'Retour'
    };

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
            var vcl = {
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

                display: function() {
                    var vclBody = document.getElementById("page_content");
                    var vehicule = createDiv(vclBody, "vehicule");
                    var vclInfo = createDiv(vehicule);
                    vclInfo.setAttribute("style", "border: 1px none; grid-row: 1/3;");

                    createHeader(vclInfo, 2, this.title);
                    createDiv(vclInfo).innerHTML = this.thumbnail;

                    var reservationDiv = createDiv(vehicule, 'reservation');
                    reservationDiv.setAttribute("style", "border: 1px none; grid-row: 1/3;");
                    reservationDiv.setAttribute("id", "reservation" + vcl.id);

                    var departure = createDiv(reservationDiv, "labelvalue");
                    var depLabel = createDiv(departure, "label");
                    depLabel.append(voc.labelDepart);
                    this.depValue = createDiv(departure, "value");
                    this.depDayTimePicker = createDiv(reservationDiv);
                    replaceDayTimePicker(newDeparturePickerRenderer(this));

                    this.returnContainer = createDiv(reservationDiv);
                    this.returnContainer.style.display = 'none';
                    returnLabelValue = createDiv(this.returnContainer, "labelvalue");
                    retLabel = createDiv(returnLabelValue, "label");
                    retLabel.append(voc.labelReturn);
                    this.retValue = createDiv(returnLabelValue, "value");
                    this.retDayTimePicker = createDiv(this.returnContainer);
                },

                depValue: null,
                departureDaySet: function(renderer) {
                    this.displayValue(this.depValue, renderer);
                },
                departureTimeSet: function(renderer) {
                    var clickHandler = function(event) {
                        vcl.hideReturnContainer();
                        vcl.displayValue(event.target, renderer);
                        replaceDayTimePicker(renderer);
                        event.target.removeEventListener(event.type, clickHandler);
                    };
                    this.displayValue(this.depValue, renderer, clickHandler);
                    this.replaceDeparturePicker(document.createElement('div'));

                    this.retYear = this.depYear;
                    this.retMonth = this.depMonth;
                    this.retDay = this.depDay;
                    this.retHour = this.depHour;
                    this.retMin = this.depMin;

                    this.displayReturnContainer();
                },

                depDayTimePicker: null,
                replaceDeparturePicker: function(newDayTimePicker) {
                    this.depDayTimePicker.parentElement.replaceChild(newDayTimePicker, this.depDayTimePicker);
                    this.depDayTimePicker = newDayTimePicker;
                },

                returnContainer: null,
                displayReturnContainer: function() {
                    if(displayElement(this.returnContainer)) {
                        replaceDayTimePicker(newReturnPickerRenderer(this));
                    }
                },
                hideReturnContainer: function() {
                    hideElement(this.returnContainer);
                },

                retValue: null,
                returnDaySet: function(renderer) {
                    this.displayValue(this.retValue, renderer);
                },
                returnTimeSet: function(renderer) {
                    var clickHandler = function(event) {
                        vcl.displayValue(event.target, renderer);
                        replaceDayTimePicker(renderer);
                        event.target.removeEventListener(event.type, clickHandler);
                    };
                    this.displayValue(this.retValue, renderer, clickHandler);
                    this.replaceReturnPicker(document.createElement('div'));
                },

                retDayTimePicker: null,
                replaceReturnPicker: function(newDayTimePicker) {
                    this.retDayTimePicker.parentElement.replaceChild(newDayTimePicker, this.retDayTimePicker);
                    this.retDayTimePicker = newDayTimePicker;
                },

                displayValue: function(element, renderer, clickHandler) {
                    if(clickHandler) {
                        element.setAttribute('class', 'value');
                        element.addEventListener('click', clickHandler);
                    } else {
                        element.setAttribute('class', 'non-clickable-value');
                    }
                    element.innerHTML = getSelectedDayTime(renderer);
                    element.parentElement.replaceChild(element, element);
                }
            };
            return vcl;
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
                    vcl.display();
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

    function refreshDayTimePicker(renderer) {
        var req = new XMLHttpRequest();
        var url = slCal.siteURL + '/wp-json/slplugin/v1/agenda/vcl=' + renderer.vcl.id + "/year=" + renderer.year + "/month=" + renderer.month;
        if(!isNaN(renderer.day)) {
            url += '/day=' + renderer.day;
        }
        if(!isNaN(renderer.hour)) {
            url += '/hour=' + renderer.hour;
        }
        if(!isNaN(renderer.min)) {
            url += '/min=' + renderer.min;
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

    function newDeparturePickerRenderer(vcl) {
        var departDayTimeRenderer = {
            vcl: vcl,
            year: vcl.depYear,
            month: vcl.depMonth,
            day: vcl.depDay,
            hour: vcl.depHour,
            min: vcl.depMin,
            getMonthName: function() {
                return voc.months[this.month - 1];
            },
            getDayNames: function() {
                return voc.weekDays;
            },
            isPrevMonthAvailable: function() {
                var curDate = new Date();
                if(curDate.getFullYear() < this.year || curDate.getMonth() < this.month - 1) {
                    return true;
                }
                return false;
            },
            isNextMonthAvailable: function() {
                return true;
            },
            getFirstActiveDay: function() {
                var curDate = new Date();
                if(curDate.getFullYear() == this.year && curDate.getMonth() == this.month - 1) {
                    var firstActiveDay = curDate.getDate();
                    if(!isDayAvailable(curDate)) {
                        firstActiveDay++;
                    }
                    return firstActiveDay;
                }
                if(curDate.getFullYear() < this.year || curDate.getMonth() < this.month - 1) {
                    return 1;
                }
                return 100;
            },
            getFirstActiveHour: function() {
                var curDate = new Date();
                if(curDate.getFullYear() == this.year && curDate.getMonth() == this.month - 1 && curDate.getDate() == this.day) {
                    var fah = curDate.getHours() + 2;
                    if(curDate.getMinutes() > 30) {
                        fah++;
                    }
                    return fah;
                }
                return 8;
            },
            newDayElement: function(i) {
                var dayDiv = document.createElement("div");
                dayDiv.append(i);
                if(this.day == i) {
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
                if(!this.day) {
                    timeClicky.setAttribute("class", "disabled-clicky");
                    return true;
                }
                var dayAgenda = getDayAgenda(this.day, this.vcl.agenda);
                if(!isTimeAvailable(hour, mins, dayAgenda)) {
                    if(prevTimeAdded) {
                        timeClicky.setAttribute("class", "disabled-clicky");
                    } else {
                        timepicker.removeChild(timeClicky);
                    }
                    return false;
                }
                if(hour == this.hour && mins == this.min) {
                    timeClicky.setAttribute("class", "selected-clicky");
                } else {
                    timeClicky.setAttribute("class", "clicky");
                }
                timeClicky.addEventListener('click', function(event) {
                    var text = event.target.innerHTML;
                    var colon = text.indexOf(':');
                    departDayTimeRenderer.setTime(text.substring(0, colon), text.substring(colon + 1));
                });
                return true;
            },
            replaceDayTimePicker: function(newDayTimePicker) {
                this.vcl.replaceDeparturePicker(newDayTimePicker);
            },
            setMonth: function(year, month) {
                this.year = parseInt(year);
                this.month = parseInt(month);
                if(this.vcl.depMonth == this.month) {
                    this.day = this.vcl.depDay;
                    this.hour = this.vcl.depHour;
                    this.min = this.vcl.depMin;
                } else {
                    this.day = NaN;
                    this.hour = NaN;
                    this.min = NaN;
                }
                refreshDayTimePicker(this);
            },
            setDay: function(day) {
                this.day = parseInt(day);
                this.hour = NaN;
                this.min = NaN;
                refreshDayTimePicker(this);
                this.updateVcl();
                this.vcl.departureDaySet(this);
            },
            setTime: function(hour, min) {
                this.hour = parseInt(hour);
                this.min = parseInt(min);
                this.updateVcl();
                this.vcl.departureTimeSet(this);
            },
            updateVcl: function() {
                this.vcl.depYear = this.year;
                this.vcl.depMonth = this.month;
                this.vcl.depDay = this.day;
                this.vcl.depHour = this.hour;
                this.vcl.depMin = this.min;
            }
        };
        return departDayTimeRenderer;
    }

    function newReturnPickerRenderer(vcl) {
        var renderer = {
            vcl: vcl,
            year: vcl.retYear,
            month: vcl.retMonth,
            day: vcl.retDay,
            hour: vcl.retHour,
            min: vcl.retMin,
            getMonthName: function() {
                return voc.months[this.month - 1];
            },
            getDayNames: function() {
                return voc.weekDays;
            },
            isPrevMonthAvailable: function() {
                return this.vcl.depYear < this.year || this.vcl.depMonth < this.month;
            },
            isNextMonthAvailable: function() {
                return true;
            },
            getFirstActiveDay: function() {
                if(this.vcl.depYear == this.year && this.vcl.depMonth == this.month) {
                    return this.vcl.depDay;
                }
                if(this.vcl.depYear < this.year || this.vcl.depMonth < this.month) {
                    return 1;
                }
                return 100;
            },
            getFirstActiveHour: function() {
                if(this.vcl.depYear == this.year && this.vcl.depMonth == this.month && this.vcl.depDay == this.day) {
                    if(this.vcl.depMin == 0) {
                        return this.vcl.depHour + 2;
                    }
                    return this.vcl.depHour + 3;
                }
                return 8;
            },
            newDayElement: function(i) {
                var dayDiv = document.createElement("div");
                dayDiv.append(i);
                if(this.day == i) {
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
                            renderer.setDay(event.target.innerHTML);
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
                if(!this.day) {
                    timeClicky.setAttribute("class", "disabled-clicky");
                    return true;
                }
                var dayAgenda = getDayAgenda(this.day, this.vcl.agenda);
                if(!isTimeAvailable(hour, mins, dayAgenda)) {
                    if(prevTimeAdded) {
                        timeClicky.setAttribute("class", "disabled-clicky");
                    } else {
                        timepicker.removeChild(timeClicky);
                    }
                    return false;
                }
                if(hour == this.hour && mins == this.min) {
                    timeClicky.setAttribute("class", "selected-clicky");
                } else {
                    timeClicky.setAttribute("class", "clicky");
                }
                timeClicky.addEventListener('click', function(event) {
                    var text = event.target.innerHTML;
                    var colon = text.indexOf(':');
                    renderer.setTime(text.substring(0, colon), text.substring(colon + 1));
                });
                return true;
            },
            replaceDayTimePicker: function(newDayTimePicker) {
                this.vcl.replaceReturnPicker(newDayTimePicker);
            },
            setMonth: function(year, month) {
                this.year = parseInt(year);
                this.month = parseInt(month);
                if(this.vcl.retMonth == this.month) {
                    this.day = this.vcl.retDay;
                    this.hour = this.vcl.retHour;
                    this.min = this.vcl.retMin;
                } else {
                    this.day = NaN;
                    this.hour = NaN;
                    this.min = NaN;
                }
                refreshDayTimePicker(this);
            },
            setDay: function(day) {
                this.day = parseInt(day);
                this.hour = NaN;
                this.min = NaN;
                refreshDayTimePicker(this);
                this.updateVcl();
                this.vcl.returnDaySet(this);
            },
            setTime: function(hour, min) {
                this.hour = parseInt(hour);
                this.min = parseInt(min);
                this.updateVcl();
                this.vcl.returnTimeSet(this);
            },
            updateVcl: function() {
                this.vcl.retYear = this.year;
                this.vcl.retMonth = this.month;
                this.vcl.retDay = this.day;
                this.vcl.retHour = this.hour;
                this.vcl.retMin = this.min;
            }
        };
        return renderer;
    }

    function getSelectedDayTime(renderer) {
        return toTwoChars(renderer.day) + '.' + toTwoChars(renderer.month) + '.' + renderer.year + ' ' +
            toTwoChars(renderer.hour) + ':' + toTwoChars(renderer.min);
    }

    function toTwoChars(i) {
        if(isNaN(i)) {
            return '__';
        }
        if(i <= 9) {
            return '0' + i;
        }
        return i;
    }

    var isDayAvailable = function(date) {
        return 12*60 - date.getHours()*60 - date.getMinutes() > 120;
    };

    var displayElement = function(e) {
        if(e.style.display === 'initial') {
            return false;
        }
        e.style.display = 'initial';
        e.parentElement.replaceChild(e, e);
        return true;
    };

    var hideElement = function(e) {
        if(e.style.display === 'none') {
            return false;
        }
        e.style.display = 'none';
        e.parentElement.replaceChild(e, e);
        return true;
    };

  });

})(jQuery);

