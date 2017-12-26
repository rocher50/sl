(function($) {

  $(document).ready(function() {

    if(window.location.pathname === '/') {
        displayFleet(new Date());
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

                contactsDiv: null,

                display: function(agenda) {

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
                    newDeparturePickerRenderer(this).setAgenda(agenda);

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

                updateAgenda: function(renderer, year, month) {
                    var req = new XMLHttpRequest();
                    var url = slCal.siteURL + '/wp-json/slplugin/v1/agenda/vcl=' + this.id + "/year=" + year + "/month=" + month;
                    req.open('GET', url);
                    req.onload = function() {
                        if(req.status >= 200 && req.status < 400) {
                            var data = JSON.parse(req.responseText);
                            renderer.setAgenda(data.days);
                        } else {
                            alert('Server returned an error');
                        }
                    };
                    req.onerror = function() {
                        alert('Connection error');
                    };
                    req.send();
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
                    returnRenderer.initDate(renderer.agenda);
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

    function displayFleet(date) {
        var req = new XMLHttpRequest();
        var url = slCal.siteURL + '/wp-json/slplugin/v1/fleet/year=' + date.getFullYear() + "/month=" + (date.getMonth() + 1);
        req.open('GET', url);
        req.onload = function() {
            if(req.status >= 200 && req.status < 400) {
                var fleetInfo = JSON.parse(req.responseText);
                for(var i = 0; i < fleetInfo.length; i++) {
                    var vclInfo = fleetInfo[i];
                    var vcl = fleet.getVcl(vclInfo.id);
                    vcl.title = vclInfo.title;
                    vcl.thumbnail = vclInfo.thumbnail;
                    vcl.depDate = date;
                    vcl.display(vclInfo.agenda.days);
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
                renderer.agenda = data.days;
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
            agenda: null,
            firstAvailableDate: null,

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
                this.firstAvailableDate = new Date();
                if(this.year != this.firstAvailableDate.getFullYear() || this.month != this.firstAvailableDate.getMonth() + 1) {
                    this.firstAvailableDate = new Date(this.year, this.month -1 , 1, firstAvailableHour, firstAvailableMin, 0);
                } else if(this.firstAvailableDate.getHours()*60 + this.firstAvailableDate.getMinutes() > lastAvailableHour*60 + lastAvailableMin - minRentMinutes) {
                    var curMonth = this.firstAvailableDate.getMonth();
                    this.firstAvailableDate = new Date(this.firstAvailableDate.getFullYear(), this.firstAvailableDate.getMonth(), this.firstAvailableDate.getDate() + 1, firstAvailableHour, firstAvailableMin, 0);
                    if(curMonth != this.firstAvailableDate.getMonth()) {
                        alert("Failed to resolve the first available day");
                        return new Date(this.firstAvailableDate.getFullYear(), this.firstAvailableDate.getMonth(), this.firstAvailableDate.getDate() - 1, lastAvailableHour, lastAvailableMin, 0);
                    }
                }

                while(true) {
                    var dayAgenda = getDayAgenda(this.firstAvailableDate.getDate(), this.agenda);
                    if(dayAgenda == null) {
                        return this.firstAvailableDate.getDate();
                    }
                    if(dayAgenda.available) {
                        var i = 0;
                        while(i < dayAgenda.bookings.length) {
                            if(this.firstAvailableDate.getHours()*60 + this.firstAvailableDate.getMinutes() <= dayAgenda.bookings[i]*60 - minRentMinutes - pauseMinutes) {
                                return this.firstAvailableDate.getDate();
                            }
                            this.firstAvailableDate = new Date(this.firstAvailableDate.getFullYear(), this.firstAvailableDate.getMonth(), this.firstAvailableDate.getDate(), 0, 0, 0);
                            this.firstAvailableDate = new Date(this.firstAvailableDate.getTime() + (dayAgenda.bookings[i]*60 + dayAgenda.bookings[i + 1]*60 + pauseMinutes)*60*1000);
                            i += 2;
                        }
                    }
                    var curMonth = this.firstAvailableDate.getMonth();
                    this.firstAvailableDate = new Date(this.firstAvailableDate.getFullYear(), this.firstAvailableDate.getMonth(), this.firstAvailableDate.getDate() + 1, firstAvailableHour, firstAvailableMin, 0);
                    if(curMonth != this.firstAvailableDate.getMonth()) {
                        alert("Failed to resolve the first available day");
                        return new Date(this.firstAvailableDate.getFullYear(), this.firstAvailableDate.getMonth(), this.firstAvailableDate.getDate() - 1, lastAvailableHour, lastAvailableMin, 0);
                    }
                }
            },
            getFirstWorkingHour: function() {
                return firstAvailableHour;
            },
            getFirstWorkingHourMin: function() {
                return firstAvailableMin;
            },
            getLastWorkingHour: function() {
                return lastAvailableHour;
            },
            getLastWorkingHourMin: function() {
                return lastAvailableMin;
            },
            getFirstActiveHour: function() {
                return this.firstAvailableDate.getHours();
            },
            newDayElement: function(i) {
                var dayDiv = document.createElement("div");
                dayDiv.append(i);
                if(this.day == i) {
                    dayDiv.setAttribute("class", "selected-clicky");
                } else {
                    var dayAgenda = getDayAgenda(i, this.agenda);
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
                if(this.day == this.firstAvailableDate.getDate() && this.firstAvailableDate.getHours()*60 + this.firstAvailableDate.getMinutes() > hour*60 + mins) {
                    return false;
                }
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
                var dayAgenda = getDayAgenda(this.day, this.agenda);
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
            setAgenda: function(agenda) {
                this.agenda = agenda;
                replaceDayTimePicker(this);
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
                this.vcl.updateAgenda(this, year, month);
            },
            setDay: function(day) {
                this.day = day;
                this.hour = NaN;
                this.min = NaN;
                replaceDayTimePicker(this);
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
            agenda: null,

            nextMonthEnabled: NaN,
            firstAvailableDay: NaN,
            firstAvailableTime: NaN,
            lastAvailableDate: null,

            initDate: function(agenda) {
                var curAgenda = this.agenda;
                this.recalcBoundaries(this.vcl.depDate, agenda);

                if(this.vcl.retDate == null
                    || this.lastAvailableDate != null && this.vcl.retDate > this.lastAvailableDate
                    || this.vcl.retDate < this.firstAvailableTime
                    || this.vcl.depDate.getMonth() != this.vcl.retDate.getMonth()
                    || this.vcl.depDate.getFullYear() != this.vcl.retDate.getFullYear()) {
                    this.vcl.retDate = this.firstAvailableTime;
                    this.year = this.vcl.retDate.getFullYear();
                    this.month = this.vcl.retDate.getMonth() + 1;
                    this.day = this.vcl.retDate.getDate();
                    this.hour = NaN;
                    this.min = NaN;
                    this.agenda = agenda;
                } else {
                    this.agenda = curAgenda;
                }
            },

            recalcBoundaries: function(date, agenda) {
                this.nextMonthEnabled = true;
                var monthAgendaLength = agenda.length;
                var dayAgenda = getDayAgenda(32, agenda);
                if(dayAgenda != null) {
                    monthAgendaLength = agenda.length - 1;
                    if(!dayAgenda.available
                        || firstAvailableHour*60 + firstAvailableMin > dayAgenda.bookings[0]*60 - pauseMinutes) {
                        this.nextMonthEnabled = false;
                    }
                }

                this.lastAvailableDate = null;
                this.agenda = agenda;

                var i = 0;
                while(i < monthAgendaLength && this.lastAvailableDate == null) {
                    var dayAgenda = agenda[i++];
                    if(date.getDate() < dayAgenda.day) {
                        this.nextMonthEnabled = false;
                        if(!dayAgenda.available) {
                            this.lastAvailableDate = new Date(date.getFullYear(), date.getMonth(), dayAgenda.day - 1, lastAvailableHour, lastAvailableMin, 0);
                        } else {
                            this.lastAvailableDate = new Date(date.getFullYear(), date.getMonth(), dayAgenda.day, 0, 0, 0);
                            this.lastAvailableDate = new Date(this.lastAvailableDate.getTime() + (dayAgenda.bookings[0]*60 - pauseMinutes)*60*1000);
                            if(this.lastAvailableDate.getHours() < firstAvailableHour ||
                                this.lastAvailableDate.getHours() == firstAvailableHour && this.lastAvailableDate.getMinutes() < firstAvailableMin) {
                                this.lastAvailableDate = new Date(date.getFullYear(), date.getMonth(), dayAgenda.day - 1, lastAvailableHour, lastAvailableMin, 0);
                            }
                        }
                        break;
                    }
                    if(date.getDate() == dayAgenda.day) {
                        if(!dayAgenda.available) {
                            this.nextMonthEnabled = false;
                            this.lastAvailableDate = new Date(date.getFullYear(), date.getMonth(), dayAgenda.day, firstAvailableHour, firstAvailableMin, 0);
                            break;
                        }
                        var dayInMillis = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0).getTime();
                        var t = 0;
                        while(t < dayAgenda.bookings.length) {
                            var bookingTime = new Date(dayInMillis + (dayAgenda.bookings[t]*60 - pauseMinutes)*60*1000);
                            if(date < bookingTime) {
                                this.nextMonthEnabled = false;
                                this.lastAvailableDate = bookingTime;
                                break;
                            }
                            if(date === bookingTime) {
                                alert("error");
                            }
                            t += 2;
                        }
                    }
                }

                this.recalcFirstAvailableTime(date.getFullYear(), date.getMonth() + 1, date.getDate());
                this.firstAvailableDay = this.firstAvailableTime.getDate();
            },

            recalcFirstAvailableTime: function(year, month, day) {
                if(day == this.vcl.depDate.getDate() && month - 1 == this.vcl.depDate.getMonth() && year == this.vcl.depDate.getFullYear()) {
                    this.firstAvailableTime = new Date(this.vcl.depDate.getTime() + 1000*60*minRentMinutes);
                    if(this.firstAvailableTime.getHours() > lastAvailableHour ||
                        this.firstAvailableTime.getHours() == lastAvailableHour && this.firstAvailableTime.getMinutes() > lastAvailableMin) {
                        this.firstAvailableTime.setDate(firstAvailableTime.getDate() + 1);
                        this.firstAvailableTime.setHours(firstAvailableHour);
                        this.firstAvailableTime.setMinutes(firstAvailableMin);
                    }
                } else {
                    this.firstAvailableTime = new Date(year, month - 1, day, firstAvailableHour, firstAvailableMin, 0);
                }

                var dayAgenda = getDayAgenda(day, this.agenda);
                if(dayAgenda == null || !dayAgenda.available) {
                    return;
                }

                var i = 0;
                while(i < dayAgenda.bookings.length) {
                    var bookingTime = new Date(year, month - 1, day, 0, 0, 0);
                    bookingTime = new Date(bookingTime.getTime() + (dayAgenda.bookings[i]*60 - pauseMinutes)*60*1000);
                    if(this.firstAvailableTime < bookingTime) {
                        return;
                    }
                    bookingTime = new Date(bookingTime.getTime() + (dayAgenda.bookings[i + 1]*60 + pauseMinutes)*60*1000);
                    if(this.firstAvailableTime === bookingTime) {
                        return;
                    }
                    i += 2;
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
            getFirstWorkingHour: function() {
                return firstAvailableHour;
            },
            getFirstWorkingHourMin: function() {
                return firstAvailableMin;
            },
            getLastWorkingHour: function() {
                return lastAvailableHour;
            },
            getLastWorkingHourMin: function() {
                return lastAvailableMin;
            },
            getFirstActiveHour: function() {
                return this.firstAvailableTime.getHours();
            },
            newDayElement: function(i) {
                var dayDiv = document.createElement("div");
                dayDiv.append(i);
                if(this.day == i) {
                    dayDiv.setAttribute("class", "selected-clicky");
                } else {
                    if(this.lastAvailableDate == null || i < this.lastAvailableDate.getDate()) {
                        dayClass = "clicky";
                    } else if(i == this.lastAvailableDate.getDate()) {
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
                if(hour == this.firstAvailableTime.getHours() && mins < this.firstAvailableTime.getMinutes()) {
                    return false;
                }
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

                if(this.lastAvailableDate != null && this.lastAvailableDate.getDate() == this.day &&
                    (this.lastAvailableDate.getHours() < hour ||
                    this.lastAvailableDate.getHours() == hour && this.lastAvailableDate.getMinutes() < mins)) {
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
            setAgenda: function(agenda) {
                this.agenda = agenda;
                if(this.vcl.depDate.getFullYear() == this.year && this.vcl.depDate.getMonth() == this.month - 1) {
                    this.recalcBoundaries(this.vcl.depDate, agenda);
                } else {
                    this.recalcBoundaries(new Date(this.year, this.month - 1, 1, 0, 0, 0), agenda);
                }
                replaceDayTimePicker(this);
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
                if(this.vcl.depDate.getFullYear() == year && this.vcl.depDate.getMonth() == month - 1) {
                    this.vcl.updateAgenda(this, this.vcl.depDate.getFullYear(), this.vcl.depDate.getMonth() + 1);
                } else {
                    this.vcl.updateAgenda(this, year, month);
                }
            },
            setDay: function(day) {
                this.day = day;
                this.hour = NaN;
                this.min = NaN;
                this.recalcFirstAvailableTime(this.year, this.month, day);
                replaceDayTimePicker(this);
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
                this.vcl.retDate.setHours(0);
                this.vcl.retDate.setMinutes(0);
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
            if(day == dayAgenda.day) {
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
        if(!dayAgenda.available) {
            return false;
        }
        var timeInMin = hour*60 + mins;
        var bookings = dayAgenda.bookings;
        for(var i = 0; i < bookings.length; i += 2) {
            var bookingStart = bookings[i]*60 - minRentMinutes - pauseMinutes;
            if(timeInMin <= bookingStart) {
                return true;
            }
            if(timeInMin < bookings[i]*60 + bookings[i+1]*60 + pauseMinutes) {
                return false;
            }
        }
        return true;
    }

    var isDayAvailable = function(date) {
        return lastAvailableHour*60 + lastAvailableMin - date.getHours()*60 - date.getMinutes() > 120;
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

