(function($) {

  $(document).ready(function() {

    if(window.location.pathname === '/') {
        var date = new Date();
        displayFleet(date.getFullYear(), date.getMonth() + 1, date.getDate());
    }

    var voc = {
        'months': ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
        'weekDays': ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'],
        'labelDepart': 'Départ',
        'labelReturn': 'Retour',
        'labelFirstName': 'Prénom',
        'labelLastName': 'Nom',
        'labelEmail': 'E-mail',
        'labelPhone': 'Téléphone',
        'labelStreet': 'Adresse',
        'labelCity': 'Ville',
        'labelZip': 'NPA',
        'labelCountry': 'Pays',
    };

    var firstAvailableHour = 8;
    var firstAvailableMin = 30;
    var lastAvailableHour = 19;
    var lastAvailableMin = 0;
    var minRentMinutes = 60;
    var pauseMinutes = 30;

    var clientFirstName = null;
    var clientLastName = null;

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
                depDate: null,
                retDate: null,
                agenda: null,

                contactsDiv: null,

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

                    this.contactsDiv = document.createElement('div');
                    this.contactsDiv.style.display = 'none';
                    var firstnameContainer = createDiv(this.contactsDiv, 'labelvalue');
                    var firstnameLabel = createDiv(firstnameContainer, 'label');
                    firstnameLabel.append(voc.labelFirstName);

                    var lastnameContainer = createDiv(this.contactsDiv, 'labelvalue');
                    var lastnameLabel = createDiv(lastnameContainer, 'label');
                    lastnameLabel.append(voc.labelLastName);

                    var emailContainer = createDiv(this.contactsDiv, 'labelvalue');
                    var emailLabel = createDiv(emailContainer, 'label');
                    emailLabel.append(voc.labelEmail);

                    var phoneContainer = createDiv(this.contactsDiv, 'labelvalue');
                    var phoneLabel = createDiv(phoneContainer, 'label');
                    phoneLabel.append(voc.labelPhone);

                    var streetContainer = createDiv(this.contactsDiv, 'labelvalue');
                    var streetLabel = createDiv(streetContainer, 'label');
                    streetLabel.append(voc.labelStreet);

                    var cityContainer = createDiv(this.contactsDiv, 'labelvalue');
                    var cityLabel = createDiv(cityContainer, 'label');
                    cityLabel.append(voc.labelCity);

                    var zipContainer = createDiv(this.contactsDiv, 'labelvalue');
                    var zipLabel = createDiv(zipContainer, 'label');
                    zipLabel.append(voc.labelZip);

                    var countryContainer = createDiv(this.contactsDiv, 'labelvalue');
                    var countryLabel = createDiv(countryContainer, 'label');
                    countryLabel.append(voc.labelCountry);

                    reservationDiv.appendChild(this.contactsDiv);
                },

                depValue: null,
                departureDaySet: function(renderer) {
                    this.displayValue(this.depValue, renderer);
                },
                departureTimeSet: function(renderer) {
                    var clickHandler = function(event) {
                        vcl.hideContacts();
                        vcl.hideReturnContainer();
                        vcl.displayValue(event.target, renderer);
                        replaceDayTimePicker(renderer);
                        event.target.removeEventListener(event.type, clickHandler);
                    };
                    this.displayValue(this.depValue, renderer, clickHandler);
                    this.replaceDeparturePicker(document.createElement('div'));

                    var returnRenderer = this.getReturnPickerRenderer();
                    returnRenderer.initDate();
                    this.returnDaySet(returnRenderer);
                    this.displayReturnContainer();
                },

                depDayTimePicker: null,
                replaceDeparturePicker: function(newDayTimePicker) {
                    this.depDayTimePicker.parentElement.replaceChild(newDayTimePicker, this.depDayTimePicker);
                    this.depDayTimePicker = newDayTimePicker;
                },

                returnContainer: null,
                returnPickerRenderer: null,
                getReturnPickerRenderer: function() {
                    if(this.returnPickerRenderer == null) {
                        this.returnPickerRenderer = newReturnPickerRenderer(this);
                    }
                    return this.returnPickerRenderer;
                },
                displayReturnContainer: function() {
                    if(displayElement(this.returnContainer)) {
                        replaceDayTimePicker(this.getReturnPickerRenderer());
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
                        vcl.hideContacts();
                        vcl.displayValue(event.target, renderer);
                        replaceDayTimePicker(renderer);
                        event.target.removeEventListener(event.type, clickHandler);
                    };
                    this.displayValue(this.retValue, renderer, clickHandler);
                    this.replaceReturnPicker(document.createElement('div'));

                    this.displayContacts();
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
                },

                displayContacts: function() {
                    this.contactsDiv.style.display = 'initial';
                    this.contactsDiv.parentElement.replaceChild(this.contactsDiv, this.contactsDiv);
                },
                hideContacts: function() {
                    hideElement(this.contactsDiv);
                }
            };
            return vcl;
        }
    };

    function displayFleet(year, month, day) {
        var req = new XMLHttpRequest();
        var url = slCal.siteURL + '/wp-json/slplugin/v1/fleet/year=' + year + "/month=" + month + "/day=" + day;
        req.open('GET', url);
        req.onload = function() {
            if(req.status >= 200 && req.status < 400) {
                var fleetInfo = JSON.parse(req.responseText);
                for(var i = 0; i < fleetInfo.length; i++) {
                    var vclInfo = fleetInfo[i];
                    var vcl = fleet.getVcl(vclInfo.id);
                    vcl.title = vclInfo.title;
                    vcl.thumbnail = vclInfo.thumbnail;
                    vcl.depDate = new Date(vclInfo.agenda.date);
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
            year: vcl.depDate.getFullYear(),
            month: vcl.depDate.getMonth() + 1,
            day: vcl.depDate.getDate(),
            hour: vcl.depDate.getHours(),
            min: vcl.depDate.getMinutes(),
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
                return this.firstAvailableHour;
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
                            departDayTimeRenderer.setDay(parseInt(event.target.innerHTML));
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
                    departDayTimeRenderer.setTime(parseInt(text.substring(0, colon)), parseInt(text.substring(colon + 1)));
                });
                return true;
            },
            replaceDayTimePicker: function(newDayTimePicker) {
                this.vcl.replaceDeparturePicker(newDayTimePicker);
            },
            setMonth: function(year, month) {
                this.year = year;
                this.month = month;
                if(this.vcl.depDate.getFullYear() == year && this.vcl.depDate.getMonth() + 1 == this.month) {
                    this.day = this.vcl.depDate.getDate();
                    this.hour = this.vcl.depDate.getHours();
                    this.min = this.vcl.depDate.getMinutes();
                } else {
                    this.day = NaN;
                    this.hour = NaN;
                    this.min = NaN;
                }
                refreshDayTimePicker(this);
            },
            setDay: function(day) {
                this.day = day;
                this.hour = NaN;
                this.min = NaN;
                refreshDayTimePicker(this);
                this.updateVcl();
                this.vcl.departureDaySet(this);
            },
            setTime: function(hour, min) {
                this.hour = hour;
                this.min = min;
                this.updateVcl();
                this.vcl.departureTimeSet(this);
            },
            updateVcl: function() {
                this.vcl.depDate.setFullYear(this.year, this.month - 1, this.day);
                if(!isNaN(this.hour)) {
                    this.vcl.depDate.setHours(this.hour);
                }
                if(!isNaN(this.min)) {
                    this.vcl.depDate.setMinutes(this.min);
                }
            }
        };
        return departDayTimeRenderer;
    }

    function newReturnPickerRenderer(vcl) {
        var renderer = {
            vcl: vcl,
            year: null,
            month: null,
            day: null,
            hour: NaN,
            min: NaN,

            nextMonthEnabled: NaN,
            firstAvailableDay: NaN,
            lastAvailableDay: NaN,
            lastAvailableHour: NaN,
            lastAvailableMin: NaN,

            initDate: function() {
                this.recalcBoundaries(this.vcl.depDate);

                var firstAvailableDate = new Date(this.vcl.depDate.getTime() + 1000*60*minRentMinutes);
                if(firstAvailableDate.getHours() > lastAvailableHour) {
                    firstAvailableDate.setDate(firstAvailableDate.getDate() + 1);
                }

                var lastAvailableDate = null;
                if(!isNaN(this.lastAvailableDay)) {
                    lastAvailableDate = new Date(this.vcl.depDate.getFullYear(), this.vcl.depDate.getMonth(), this.lastAvailableDay, lastAvailableHour, lastAvailableMin, 0);
                    if(!isNaN(this.lastAvailableHour)) {
                        lastAvailableDate.setHours(this.lastAvailableHour);
                    }
                    if(!isNaN(this.lastAvailableMin)) {
                        lastAvailableDate.setMinutes(this.lastAvailableMin);
                    }
                    if(firstAvailableDate > lastAvailableDate) {
                        firstAvailableDate = lastAvailableDate;
                    }
                }

                this.firstAvailableDay = firstAvailableDate.getDate();
                if(this.vcl.retDate == null) {
                    this.vcl.retDate = firstAvailableDate;
                } else if(this.vcl.retDate < firstAvailableDate) {
                    this.vcl.retDate = firstAvailableDate;
                    this.hour = NaN;
                    this.min = NaN;
                } else if(lastAvailableDate != null && this.vcl.retDate > lastAvailableDate) {
                    this.vcl.retDate = lastAvailableDate;
                    this.hour = NaN;
                    this.min = NaN;
                }

                this.year = this.vcl.retDate.getFullYear();
                this.month = this.vcl.retDate.getMonth() + 1;
                this.day = this.vcl.retDate.getDate();
            },

            recalcBoundaries: function(date) {
                this.nextMonthEnabled = true;
                this.lastAvailableDay = NaN;
                this.lastAvailableHour = NaN;
                this.lastAvailableMin = NaN;

                var i = 0;
                while(i < this.vcl.agenda.length) {
                    var dayAgenda = this.vcl.agenda[i++];
                    if(date.getDate() < dayAgenda.day) {
                        this.nextMonthEnabled = false;
                        if(!dayAgenda.available) {
                            this.lastAvailableDay = dayAgenda.day - 1;
                            this.lastAvailableHour = lastAvailableHour;
                            this.lastAvailableMin = lastAvailableMin;
                        } else {
                            this.lastAvailableDay = dayAgenda.day;
                            var bookingTime = new Date(date.getFullYear(), date.getMonth(), dayAgenda.day, 0, 0, 0);
                            bookingTime = new Date(bookingTime.getTime() + dayAgenda.bookings[0]*60*60*1000);
                            this.lastAvailableHour = bookingTime.getHours();
                            this.lastAvailableMin = bookingTime.getMinutes();
                        }
                        break;
                    }
                    if(date.getDate() == dayAgenda.day) {
                        if(!dayAgenda.available) {
                            this.nextMonthEnabled = false;
                            this.lastAvailableDay = dayAgenda.day;
                            break;
                        }
                        var dayInMillis = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0).getTime();
                        var t = 0;
                        while(t < dayAgenda.bookings.length) {
                            var bookingTime = new Date(dayInMillis + dayAgenda.bookings[t]*60*60*1000);
                            if(date < bookingTime) {
                                this.nextMonthEnabled = false;
                                this.lastAvailableDay = dayAgenda.day;
                                this.lastAvailableHour = bookingTime.getHours();
                                this.lastAvailableMin = bookingTime.getMinutes();
                                break;
                            }
                            if(date === bookingTime) {
                                alert("error");
                            }
                            t += 2;
                        }
                    }
                }
            },

            getMonthName: function() {
                return voc.months[this.month - 1];
            },
            getDayNames: function() {
                return voc.weekDays;
            },
            isPrevMonthAvailable: function() {
                return this.vcl.depDate.getFullYear() < this.year || this.vcl.depDate.getMonth() + 1 < this.month;
            },
            isNextMonthAvailable: function() {
                return this.nextMonthEnabled;
            },
            getFirstActiveDay: function() {
                return this.firstAvailableDay;
            },
            getFirstActiveHour: function() {
                var dayAgenda = getDayAgenda(this.day, this.vcl.agenda);
                if(dayAgenda == null) {
                    if(this.day == this.vcl.depDate.getDate()) {
                        return new Date(this.vcl.depDate.getTime() + minRentMinutes*60*1000).getHours();
                    }
                    return firstAvailableHour;
                }

                if(!isNaN(this.lastAvailableDay) && this.day == this.lastAvailableDay) {
                    var bookingTime = new Date(this.year, this.month - 1, this.day, 0, 0, 0);
                    bookingTime = new Date(bookingTime.getTime() + (dayAgenda.bookings[0]*60 - pauseMinutes)*60*1000);
                    return bookingTime.getHours();
                }
                var firstAvailableTime = new Date(this.year, this.month - 1, this.day, firstAvailableHour, firstAvailableMin, 0);
                var i = 0;
                while(i < dayAgenda.bookings.length) {
                    var bookingTime = new Date(this.year, this.month - 1, this.day, 0, 0, 0);
                    bookingTime = new Date(bookingTime.getTime() + dayAgenda.bookings[i]*60*60*1000);
                    if(firstAvailableTime < bookingTime) {
                        return firstAvailableTime.getHours();
                    }
                    bookingTime = new Date(bookingTime.getTime() + (dayAgenda.bookings[i + 1]*60 + pauseMinutes)*60*1000);
                    if(firstAvailableTime === bookingTime) {
                        return firstAvailableTime.getHours();
                    }
                    firstAvailableTime = bookingTime;
                    i += 2;
                }
                return this.lastAvailableHour;
            },
            newDayElement: function(i) {
                var dayDiv = document.createElement("div");
                dayDiv.append(i);
                if(this.day == i) {
                    dayDiv.setAttribute("class", "selected-clicky");
                } else {
                    if(isNaN(this.lastAvailableDay) || i < this.lastAvailableDay) {
                        dayClass = "clicky";
                    } else if(i == this.lastAvailableDay) {
                        dayClass = "bordered-clicky";
                    } else {
                        dayClass = "disabled-clicky";
                    }

                    dayDiv.setAttribute("class", dayClass);
                    if(dayClass != "disabled-clicky") {
                        dayDiv.addEventListener('click', function(event) {
                            renderer.setDay(parseInt(event.target.innerHTML));
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

                if(!isNaN(this.lastAvailableDay) && this.lastAvailableDay == this.day &&
                    this.lastAvailableHour < hour ||
                    this.lastAvailableHour == hour && this.lastAvailableMin < mins) {
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
                    renderer.setTime(parseInt(text.substring(0, colon)), parseInt(text.substring(colon + 1)));
                });
                return true;
            },
            replaceDayTimePicker: function(newDayTimePicker) {
                this.vcl.replaceReturnPicker(newDayTimePicker);
            },
            setMonth: function(year, month) {
                this.year = year;
                this.month = month;
                if(this.vcl.retDate.getFullYear() == this.year && this.vcl.retDate.getMonth() + 1 == this.month) {
                    this.day = this.vcl.retDate.getDate();
                    this.hour = this.vcl.retDate.getHours();
                    this.min = this.vcl.retDate.getMinutes();
                } else {
                    this.day = NaN;
                    this.hour = NaN;
                    this.min = NaN;
                }
                refreshDayTimePicker(this);
            },
            setDay: function(day) {
                this.day = day;
                this.hour = NaN;
                this.min = NaN;
                refreshDayTimePicker(this);
                this.updateVcl();
                this.vcl.returnDaySet(this);
            },
            setTime: function(hour, min) {
                this.hour = hour;
                this.min = min;
                this.updateVcl();
                this.vcl.returnTimeSet(this);
            },
            updateVcl: function() {
                if(this.vcl.retDate == null) {
                    this.vcl.retDate = new Date();
                }
                this.vcl.retDate.setFullYear(this.year, this.month - 1, this.day);
                if(!isNaN(this.hour)) {
                    this.vcl.retDate.setHours(this.hour);
                }
                if(!isNaN(this.min)) {
                    this.vcl.retDate.setMinutes(this.min);
                }
            }
        };
        return renderer;
    }

    function getDayAgenda(day, days) {
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


    function isTimeAvailable(hour, mins, dayAgenda) {
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

