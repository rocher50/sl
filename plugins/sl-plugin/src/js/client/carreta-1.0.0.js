(function($) {

  $(document).ready(function() {

    if(window.location.pathname === '/') {
        displayFleet(new Date());
    }

    var defaultCursor = document.body.style.cursor;

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
        'buttonReserve': 'Réserver',
        'reserved': 'Réservé',
        'switzerland': 'Suisse',
        'reservationSent': 'Votre réservation a été enregistrée avec succès.'
    };

    var adminAjax = function(vcl) {
        $.ajax({
            type: 'POST',
            beforeSend: function() {
                $('.ajax-loader').css("visibility", "visible");
            },
            dataType: 'json',
            url: screenReaderText.adminAjax,
            data: {
                action: 'register_reservation',
                data: vcl.getReservationData(),
                submission: document.getElementById( 'xyq' + vcl.id ).value,
                security: screenReaderText.security
            },
            success: function(response) {
                if(true == response.success) {
                    vcl.displayReservationMessage('Votre réservation a été enregistrée avec succès.');
                } else {
                    vcl.displayReservationMessage('Processing has failed: ' + response.data);
                }
            },
            error: function(xhr, status, error) {
//                var err = eval('(' + xhr.responseText + ')');
//                alert(err.Message);
                vcl.displayReservationMessage('Processing has failed2: ' + xhr.responseText);
            },
            complete: function() {
                $('.ajax-loader').css("visibility", "hidden");
            }
        });
    };

    var firstAvailableHour = 8;
    var firstAvailableMin = 30;
    var lastAvailableHour = 19;
    var lastAvailableMin = 0;
    var minRentMinutes = 60;
    var pauseMinutes = 30;
    var rentFromNowMinutes = 120;

    var clientFirstName = null;
    var clientLastName = null;

    var userSubmittedReservation = document.getElementById('user-submitted-reservation');
    var xyq = document.getElementById('xyq');

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

                depValue: null,
                depDayTimePicker: null,

                returnContainer: null,
                returnPickerRenderer: null,
                retValue: null,
                retDayTimePicker: null,

                contactsDiv: null,

                firstnameLabel: null,
                firstnameInput: null,
                lastnameLabel: null,
                lastnameInput: null,
                emailLabel: null,
                emailInput: null,
                phoneLabel: null,
                phoneInput: null,
                streetLabel: null,
                streetInput: null,
                cityLabel: null,
                cityInput: null,
                zipLabel: null,
                zipInput: null,
                countryLabel: null,
                countryInput: null,
                reserveButton: null,

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
                    depLabel.append(voc.labelDepart + ':');
                    this.depValue = createDiv(departure, "value");
                    this.depDayTimePicker = createDiv(reservationDiv);
                    var depRenderer = newDeparturePickerRenderer(this);
                    depRenderer.init(agenda);
                    this.displayValue(this.depValue, depRenderer);

                    this.returnContainer = createDiv(reservationDiv);
                    this.returnContainer.style.display = 'none';
                    returnLabelValue = createDiv(this.returnContainer, "labelvalue");
                    retLabel = createDiv(returnLabelValue, "label");
                    retLabel.append(voc.labelReturn + ':');
                    this.retValue = createDiv(returnLabelValue, "value");
                    this.retDayTimePicker = createDiv(this.returnContainer);

                    this.contactsDiv = document.createElement('div');
                    this.contactsDiv.style.display = 'none';

                    var firstnameContainer = createDiv(this.contactsDiv, 'labelvalue');
                    this.firstnameLabel = createDiv(firstnameContainer, 'label highlighted');
                    this.firstnameLabel.append(voc.labelFirstName + ':');
                    this.firstnameInput = createInput(firstnameContainer, 'firstname');

                    var lastnameContainer = createDiv(this.contactsDiv, 'labelvalue');
                    this.lastnameLabel = createDiv(lastnameContainer, 'label highlighted');
                    this.lastnameLabel.append(voc.labelLastName + ':');
                    this.lastnameInput = createInput(lastnameContainer, 'lastname');

                    var emailContainer = createDiv(this.contactsDiv, 'labelvalue');
                    this.emailLabel = createDiv(emailContainer, 'label highlighted');
                    this.emailLabel.append(voc.labelEmail + ':');
                    this.emailInput = createInput(emailContainer, 'email');

                    var phoneContainer = createDiv(this.contactsDiv, 'labelvalue');
                    this.phoneLabel = createDiv(phoneContainer, 'label highlighted');
                    this.phoneLabel.append(voc.labelPhone + ':');
                    this.phoneInput = createInput(phoneContainer, 'phone');

                    var streetContainer = createDiv(this.contactsDiv, 'labelvalue');
                    this.streetLabel = createDiv(streetContainer, 'label highlighted');
                    this.streetLabel.append(voc.labelStreet + ':');
                    this.streetInput = createInput(streetContainer, 'street');

                    var cityContainer = createDiv(this.contactsDiv, 'labelvalue');
                    this.cityLabel = createDiv(cityContainer, 'label highlighted');
                    this.cityLabel.append(voc.labelCity + ':');
                    this.cityInput = createInput(cityContainer, 'city');

                    var zipContainer = createDiv(this.contactsDiv, 'labelvalue');
                    this.zipLabel = createDiv(zipContainer, 'label highlighted');
                    this.zipLabel.append(voc.labelZip + ':');
                    this.zipInput = createInput(zipContainer, 'zip');

                    var countryContainer = createDiv(this.contactsDiv, 'labelvalue');
                    this.countryLabel = createDiv(countryContainer, 'label');
                    this.countryLabel.append(voc.labelCountry + ':');
                    this.countryInput = createInput(countryContainer, 'country');
                    this.countryInput.setAttribute('placeholder', voc.switzerland);

                    var form = createChild(this.contactsDiv, 'form');
                    var buttonContainer = createDiv(form, 'button-container');

                    this.reserveButton = createChild(buttonContainer, 'button', 'button disabled');
                    this.reserveButton.append(voc.buttonReserve);
                    this.reserveButton.addEventListener('click', function(event) {
                        event.preventDefault();
                        if(vcl.isFormComplete()) {
                            vcl.reserveButton.setAttribute('class', 'button disabled');
                            vcl.reserveButton.parentElement.replaceChild(vcl.reserveButton, vcl.reserveButton);
                            adminAjax(vcl);
                        }
                    });
                    buttonContainer.appendChild(createAjaxLoader());

                    var onInput = function(event) {
                        if(vcl.isFormComplete()) {
                            ensureClass(vcl.reserveButton, 'button');
                        } else {
                            ensureClass(vcl.reserveButton, 'button disabled');
                        }
                    };
                    var labelClassHandler = function(event) {
                        if(event.target.isSameNode(vcl.firstnameInput)) {
                            if(vcl.isFirstnameValid()) {
                                ensureClass(vcl.firstnameLabel, 'label');
                            } else {
                                ensureClass(vcl.firstnameLabel, 'label highlighted');
                            }
                        } else if(event.target.isSameNode(vcl.lastnameInput)) {
                            if(vcl.isLastnameValid()) {
                                ensureClass(vcl.lastnameLabel, 'label');
                            } else {
                                ensureClass(vcl.lastnameLabel, 'label highlighted');
                            }
                        } else if(event.target.isSameNode(vcl.emailInput)) {
                            if(vcl.isEmailValid()) {
                                ensureClass(vcl.emailLabel, 'label');
                            } else {
                                ensureClass(vcl.emailLabel, 'label highlighted');
                            }
                        } else if(event.target.isSameNode(vcl.phoneInput)) {
                            if(vcl.isPhoneValid()) {
                                ensureClass(vcl.phoneLabel, 'label');
                            } else {
                                ensureClass(vcl.phoneLabel, 'label highlighted');
                            }
                        } else if(event.target.isSameNode(vcl.streetInput)) {
                            if(vcl.isStreetValid()) {
                                ensureClass(vcl.streetLabel, 'label');
                            } else {
                                ensureClass(vcl.streetLabel, 'label highlighted');
                            }
                        } else if(event.target.isSameNode(vcl.cityInput)) {
                            if(vcl.isCityValid()) {
                                ensureClass(vcl.cityLabel, 'label');
                            } else {
                                ensureClass(vcl.cityLabel, 'label highlighted');
                            }
                        } else if(event.target.isSameNode(vcl.zipInput)) {
                            if(vcl.isZipValid()) {
                                ensureClass(vcl.zipLabel, 'label');
                            } else {
                                ensureClass(vcl.zipLabel, 'label highlighted');
                            }
                        } else if(event.target.isSameNode(vcl.countryInput)) {
                            if(vcl.isCountryValid()) {
                                ensureClass(vcl.countryLabel, 'label');
                            } else {
                                ensureClass(vcl.countryLabel, 'label highlighted');
                            }
                        }
                    };
                    var onKeypress = function(event) {
                        if(event.which == 13 || event.keyCode == 13) {
                            if(event.target.isSameNode(vcl.firstnameInput)) {
                                vcl.lastnameInput.focus();
                            } else if(event.target.isSameNode(vcl.lastnameInput)) {
                                vcl.emailInput.focus();
                            } else if(event.target.isSameNode(vcl.emailInput)) {
                                vcl.phoneInput.focus();
                            } else if(event.target.isSameNode(vcl.phoneInput)) {
                                vcl.streetInput.focus();
                            } else if(event.target.isSameNode(vcl.streetInput)) {
                                vcl.cityInput.focus();
                            } else if(event.target.isSameNode(vcl.cityInput)) {
                                vcl.zipInput.focus();
                            } else if(event.target.isSameNode(vcl.zipInput)) {
                                vcl.countryInput.focus();
                            }
                        }
                    };

                    this.firstnameInput.addEventListener('keypress', onKeypress);
                    this.firstnameInput.addEventListener('input', onInput);
                    this.firstnameInput.addEventListener('input', labelClassHandler);

                    this.lastnameInput.addEventListener('keypress', onKeypress);
                    this.lastnameInput.addEventListener('input', onInput);
                    this.lastnameInput.addEventListener('input', labelClassHandler);

                    this.emailInput.addEventListener('keypress', onKeypress);
                    this.emailInput.addEventListener('input', onInput);
                    this.emailInput.addEventListener('input', labelClassHandler);

                    this.phoneInput.addEventListener('keypress', onKeypress);
                    this.phoneInput.addEventListener('input', onInput);
                    this.phoneInput.addEventListener('input', labelClassHandler);

                    this.streetInput.addEventListener('keypress', onKeypress);
                    this.streetInput.addEventListener('input', onInput);
                    this.streetInput.addEventListener('input', labelClassHandler);

                    this.cityInput.addEventListener('keypress', onKeypress);
                    this.cityInput.addEventListener('input', onInput);
                    this.cityInput.addEventListener('input', labelClassHandler);

                    this.zipInput.addEventListener('keypress', onKeypress);
                    this.zipInput.addEventListener('input', onInput);
                    this.zipInput.addEventListener('input', labelClassHandler);

                    this.countryInput.addEventListener('input', onInput);
                    this.countryInput.addEventListener('input', labelClassHandler);

                    var userSubmRes = createChild(form, 'input');
                    userSubmRes.setAttribute('type', 'hidden');
                    userSubmRes.setAttribute('name', userSubmittedReservation.getAttribute('name'));
                    userSubmRes.setAttribute('value', userSubmittedReservation.getAttribute('value'));
                    var xyqInput = createChild(form, 'input');
                    xyqInput.setAttribute('id', xyq.id + this.id);
                    xyqInput.setAttribute('type', xyq.type);
                    xyqInput.setAttribute('name', xyq.name);
                    xyqInput.setAttribute('value', xyq.value);
                    xyqInput.setAttribute('style', xyq.getAttribute('style'));
                 
                    userSubmRes.setAttribute('name', userSubmittedReservation.getAttribute('name'));
                    userSubmRes.setAttribute('value', userSubmittedReservation.getAttribute('value'));

                    reservationDiv.appendChild(this.contactsDiv);
                },

                isFirstnameValid: function() {
                    return this.firstnameInput.value.trim().length > 0;
                },
                isLastnameValid: function() {
                    return this.lastnameInput.value.trim().length > 0;
                },
                isEmailValid: function() {
                    var email = this.emailInput.value.trim();
                    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
                    return regex.test(email);
                },
                isPhoneValid: function() {
                    return this.phoneInput.value.trim().length > 0;
                },
                isStreetValid: function() {
                    return this.streetInput.value.trim().length > 0;
                },
                isCityValid: function() {
                    return this.cityInput.value.trim().length > 0;
                },
                isZipValid: function() {
                    return this.zipInput.value.trim().length > 0;
                },
                isCountryValid: function() {
                    return true;
                },

                isFormComplete: function() {
                    return vcl.isFirstnameValid()
                        && vcl.isLastnameValid()
                        && vcl.isEmailValid()
                        && vcl.isPhoneValid()
                        && vcl.isStreetValid()
                        && vcl.isCityValid()
                        && vcl.isZipValid()
                        && vcl.isCountryValid();
                },

                updateAgenda: function(renderer, year, month) {
                    var req = new XMLHttpRequest();
                    var url = screenReaderText.siteURL + '/wp-json/slplugin/v1/agenda/vcl=' + this.id + "/year=" + year + "/month=" + month;
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

                replaceDeparturePicker: function(newDayTimePicker) {
                    this.depDayTimePicker.parentElement.replaceChild(newDayTimePicker, this.depDayTimePicker);
                    this.depDayTimePicker = newDayTimePicker;
                },

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

                makeImmutable: function(element, text) {
                    var textDiv = document.createElement('div');
                    textDiv.setAttribute('class', 'non-clickable-value');
                    textDiv.innerHTML = text;
                    element.parentElement.replaceChild(textDiv, element);
                },

                displayContacts: function() {
                    this.contactsDiv.style.display = 'initial';
                    this.contactsDiv.parentElement.replaceChild(this.contactsDiv, this.contactsDiv);
                    this.firstnameInput.focus();
                },
                hideContacts: function() {
                    hideElement(this.contactsDiv);
                },

                displayReservationMessage: function(msg) {
                    var message = document.createElement('div');
                    message.setAttribute('class', 'labelvalue');
                    message.append(msg);
                    var parent = this.reserveButton.parentElement;
                    parent.parentElement.replaceChild(message, parent);
                },

                getReservationData: function() {
                    var countryValue = this.countryInput.value.trim();
                    if(countryValue.length == 0) {
                        countryValue = this.countryInput.placeholder;
                    }

                    this.makeImmutable(this.depValue, this.depValue.innerHTML);
                    this.makeImmutable(this.retValue, this.retValue.innerHTML);
                    this.makeImmutable(this.firstnameInput, this.firstnameInput.value);
                    this.makeImmutable(this.lastnameInput, this.lastnameInput.value);
                    this.makeImmutable(this.emailInput, this.emailInput.value);
                    this.makeImmutable(this.phoneInput, this.phoneInput.value);
                    this.makeImmutable(this.streetInput, this.streetInput.value);
                    this.makeImmutable(this.cityInput, this.cityInput.value);
                    this.makeImmutable(this.zipInput, this.zipInput.value);
                    this.makeImmutable(this.countryInput, countryValue);

                    var data = {
                        'first_name': this.firstnameInput.value.trim(),
                        'last_name': this.lastnameInput.value.trim(),
                        'email': this.emailInput.value.trim(),
                        'phone': this.phoneInput.value.trim(),
                        'street': this.streetInput.value.trim(),
                        'city': this.cityInput.value.trim(),
                        'zip': this.zipInput.value.trim(),
                        'country': countryValue,
                        'dep_date': toMySqlDateTime(this.depDate),
                        'ret_date': toMySqlDateTime(this.retDate),
                        'vcl': this.id};
                    return data;
                }
            };
            return vcl;
        }
    };

    function toMySqlDateTime(date) {
        return date.getFullYear()
            + '-' + toTwoChars((date.getMonth() + 1))
            + '-' + toTwoChars(date.getDate())
            + ' ' + toTwoChars(date.getHours())
            + ':' + toTwoChars(date.getMinutes());
    }

    function displayFleet(date) {
        date.setSeconds(0);
        var req = new XMLHttpRequest();
        var url = screenReaderText.siteURL + '/wp-json/slplugin/v1/fleet/year=' + date.getFullYear() + "/month=" + (date.getMonth() + 1);
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
        var url = screenReaderText.siteURL + '/wp-json/slplugin/v1/agenda/vcl=' + renderer.vcl.id + "/year=" + renderer.year + "/month=" + renderer.month;
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
            displayFirstAvailableMonth: true,

            init: function(agenda) {
                this.agenda = agenda;
                if(!this.calcFirstAvailableDate()) {
                    this.year = this.firstAvailableDate.getFullYear();
                    this.month = this.firstAvailableDate.getMonth() + 1;
                    this.day = this.firstAvailableDate.getDate();
                    this.hour = NaN;
                    this.min = NaN;
                    this.setMonth(this.firstAvailableDate.getFullYear(), this.firstAvailableDate.getMonth() + 1);
                } else {
                    this.year = this.firstAvailableDate.getFullYear();
                    this.month = this.firstAvailableDate.getMonth() + 1;
                    this.day = this.firstAvailableDate.getDate();
                    this.hour = NaN;
                    this.min = NaN;
                    replaceDayTimePicker(this);                
                }
            },

            calcFirstAvailableDate: function() {
                this.firstAvailableDate = new Date();
                this.firstAvailableDate.setSeconds(0);
                this.firstAvailableDate.setTime(this.firstAvailableDate.getTime() + rentFromNowMinutes*60*1000);
                if(this.firstAvailableDate.getHours()*60 + this.firstAvailableDate.getMinutes() < firstAvailableHour*60 + firstAvailableMin) {
                    this.firstAvailableDate.setHours(firstAvailableHour);
                    this.firstAvailableDate.setMinutes(firstAvailableMin);
                }

                if(this.year != this.firstAvailableDate.getFullYear() || this.month != this.firstAvailableDate.getMonth() + 1) {
                    this.firstAvailableDate = new Date(this.year, this.month -1 , 1, firstAvailableHour, firstAvailableMin, 0);
                } else if(this.firstAvailableDate.getHours()*60 + this.firstAvailableDate.getMinutes() > lastAvailableHour*60 + lastAvailableMin) {
                    var curMonth = this.firstAvailableDate.getMonth();
                    this.firstAvailableDate = new Date(this.firstAvailableDate.getFullYear(), this.firstAvailableDate.getMonth(), this.firstAvailableDate.getDate() + 1, firstAvailableHour, firstAvailableMin, 0);
                    if(curMonth != this.firstAvailableDate.getMonth()) {
                        return false;
                    }
                }

                while(true) {
                    var dayAgenda = getDayAgenda(this.firstAvailableDate.getDate(), this.agenda);
                    if(dayAgenda == null) {
                        return true;
                    }
                    if(dayAgenda.available) {
                        var i = 0;
                        while(i < dayAgenda.bookings.length) {
                            var booking = dayAgenda.bookings[i++];
                            if(isNaN(booking.sHour)) {
                                this.firstAvailableDate.setTime(this.firstAvailableDate.getTime()
                                    + (booking.eHour*60 + booking.eMin + pauseMinutes - this.firstAvailableDate.getHours()*60 - this.firstAvailableDate.getMinutes())*60*1000);
                                continue;
                            }
                            if(this.firstAvailableDate.getHours()*60 + this.firstAvailableDate.getMinutes() <= booking.sHour*60 + booking.sMin - minRentMinutes - pauseMinutes) {
                                return true;
                            }
                            if(isNaN(booking.eHour)) {
                                this.firstAvailableDate = new Date(this.firstAvailableDate.getFullYear(), this.firstAvailableDate.getMonth(), this.firstAvailableDate.getDate(),
                                    lastAvailableHour + 1, 0, 0);
                                break;
                            }
                            this.firstAvailableDate.setTime(this.firstAvailableDate.getTime()
                                + (booking.eHour*60 + booking.eMin + pauseMinutes - this.firstAvailableDate.getHours()*60 - this.firstAvailableDate.getMinutes())*60*1000);
                        }
                        if(this.firstAvailableDate.getHours() < lastAvailableHour
                            || this.firstAvailableDate.getHours() == lastAvailableHour && this.firstAvailableDate.getMinutes() <= lastAvailableMin) {
                            if(this.firstAvailableDate.getHours()*60 + this.firstAvailableDate.getMinutes() + minRentMinutes <= lastAvailableHour*60 + lastAvailableMin) {
                                return true;
                            }
                            var nextDay = this.firstAvailableDate.getDate() + 1;
                            if(new Date(this.firstAvailableDate.getFullYear(), this.firstAvailableDate.getMonth(), nextDay, 0, 0, 0).getMonth() != this.firstAvailableDate.getMonth()) {
                                nextDay = 32;
                            }
                            var nextDayAgenda = getDayAgenda(nextDay, this.agenda);
                            if(nextDayAgenda == null) {
                                return true;
                            }
                            if(nextDayAgenda.available) {
                                var nextDayBooking = nextDayAgenda.bookings[0];
                                if(!isNaN(nextDayBooking.sHour)
                                    && nextDayBooking.sHour*60 + nextDayBooking.sMin >= firstAvailableHour*60 + firstAvailableMin + pauseMinutes) {
                                    return true;
                                }
                            }
                        }
                    }
                    var curMonth = this.firstAvailableDate.getMonth();
                    this.firstAvailableDate = new Date(this.firstAvailableDate.getFullYear(), this.firstAvailableDate.getMonth(), this.firstAvailableDate.getDate() + 1,
                            firstAvailableHour, firstAvailableMin, 0);
                    if(curMonth != this.firstAvailableDate.getMonth()) {
                        return false;
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
                return this.firstAvailableDate.getDate();
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
                if(this.year == this.firstAvailableDate.getFullYear()
                    && this.month - 1 == this.firstAvailableDate.getMonth()
                    && this.day == this.firstAvailableDate.getDate()) {
                    return this.firstAvailableDate.getHours();
                }
                return firstAvailableHour;
            },
            newDayElement: function(i) {
                var dayDiv = document.createElement("div");
                dayDiv.append(i);
                if(this.month != this.firstAvailableDate.getMonth() + 1) {
                    dayDiv.setAttribute("class", "disabled-clicky");
                    return dayDiv;
                }
                if(this.day == i) {
                    dayDiv.setAttribute("class", "selected-clicky");
                } else {
                    var dayAgenda = getDayAgenda(i, this.agenda);
                    var dayClass;
                    var available = false;
                    if(dayAgenda == null) {
                        available = true;
                        dayClass = "clicky";
                    } else if(!dayAgenda.available) {
                        dayClass = "disabled-clicky";
                    } else {
                        var startInMin = firstAvailableHour*60 + firstAvailableMin;
                        for(var bi = 0; bi < dayAgenda.bookings.length; ++bi) {
                            var booking = dayAgenda.bookings[bi];
                            if(!isNaN(booking.sHour)
                                && startInMin + minRentMinutes + pauseMinutes <= booking.sHour*60 + booking.sMin) {
                                available = true;
                                break;
                            }
                            if(isNaN(booking.eHour)) {
                                break;
                            }
                            startInMin = booking.eHour*60 + booking.eMin + pauseMinutes;
                        }
                        if(!available && startInMin <= lastAvailableHour*60 + lastAvailableMin) {
                            if(startInMin + minRentMinutes <= lastAvailableHour*60 + lastAvailableMin) {
                                available = true;
                            } else {
                                var nextDay = i + 1;
                                if(new Date(this.year, this.month - 1, nextDay, 0, 0, 0).getMonth() != this.month - 1) {
                                    nextDay = 32;
                                }
                                var nextDayAgenda = getDayAgenda(nextDay, this.agenda);
                                if(nextDayAgenda == null) {
                                    available = true;
                                } else if(nextDayAgenda.available) {
                                    var nextDayBooking = nextDayAgenda.bookings[0];
                                    if(!isNaN(nextDayBooking.sHour)
                                        && nextDayBooking.sHour*60 + nextDayBooking.sMin >= firstAvailableHour*60 + firstAvailableMin + pauseMinutes) {
                                        available = true;
                                    }
                                }                                
                            }
                        }

                        if(available) {
                            dayClass = "bordered-clicky";
                        } else {
                            dayClass = "disabled-clicky";
                        }
                    }
                    dayDiv.setAttribute("class", dayClass);
                    if(available) {
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
                if(!this.isTimeAvailable(hour, mins, dayAgenda)) {
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
            isTimeAvailable: function(hour, mins, dayAgenda) {
                var timeInMin = hour*60 + mins;
                if(dayAgenda != null) {
                    if(!dayAgenda.available) {
                        return false;
                    }
                    var bookings = dayAgenda.bookings;
                    var i = 0;
                    while(i < bookings.length) {
                        var booking = bookings[i++];
                        if(!isNaN(booking.sHour)
                            && timeInMin <= booking.sHour*60 + booking.sMin - minRentMinutes - pauseMinutes) {
                            return true;
                        }
                        if(isNaN(booking.eHour)) {
                            return false;
                        }
                        var bookingEnd = booking.eHour*60 + booking.eMin + pauseMinutes;
                        if(timeInMin < bookingEnd) {
                            return false;
                        }
                    }
                }
                if(timeInMin > lastAvailableHour*60 + lastAvailableMin) {
                    return false;
                }
                if(timeInMin + minRentMinutes <= lastAvailableHour*60 + lastAvailableMin) {
                    return true;
                }

                var nextDay = this.day + 1;
                if(new Date(this.year, this.month - 1, nextDay, 0, 0, 0).getMonth() != this.month - 1) {
                    nextDay = 32;
                }
                var nextDayAgenda = getDayAgenda(nextDay, this.agenda);
                if(nextDayAgenda == null) {
                    return true;
                } else if(nextDayAgenda.available) {
                    var nextDayBooking = nextDayAgenda.bookings[0];
                    if(!isNaN(nextDayBooking.sHour)
                        && nextDayBooking.sHour*60 + nextDayBooking.sMin >= firstAvailableHour*60 + firstAvailableMin + pauseMinutes) {
                        return true;
                    }
                }
                return false;
            },
            replaceDayTimePicker: function(newDayTimePicker) {
                this.vcl.replaceDeparturePicker(newDayTimePicker);
            },
            setAgenda: function(agenda) {
                this.agenda = agenda;
                if(!this.calcFirstAvailableDate()) {
                    if(this.displayFirstAvailableMonth) {
                        this.setMonth(this.firstAvailableDate.getFullYear(), this.firstAvailableDate.getMonth() + 1);
                        return;
                    }
                } else if(this.displayFirstAvailableMonth) {
                    this.year = this.firstAvailableDate.getFullYear();
                    this.month = this.firstAvailableDate.getMonth() + 1;
                    this.day = this.firstAvailableDate.getDate();
                    this.hour = NaN;
                    this.min = NaN;
                    this.vcl.depDate.setFullYear(this.year);
                    this.vcl.depDate.setMonth(this.month - 1);
                    this.vcl.displayValue(this.vcl.depValue, this);
                    this.displayFirstAvailableMonth = false;
                }
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

                if(this.vcl.depDate.getMonth() != this.firstAvailableTime.getMonth()) {
                    this.vcl.updateAgenda(this, this.firstAvailableTime.getFullYear(), this.firstAvailableTime.getMonth() + 1);
                }

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
                    if(!dayAgenda.available) {
                        this.nextMonthEnabled = false;
                    } else {
                        var firstBooking = dayAgenda.bookings[0];
                        if(isNaN(firstBooking.sHour)
                            || firstAvailableHour*60 + firstAvailableMin > firstBooking.sHour*60 + firstBooking.sMin - pauseMinutes) {
                            this.nextMonthEnabled = false;
                        }
                    }
                }

                this.lastAvailableDate = null;
                this.agenda = agenda;

                var i = 0;
                while(i < monthAgendaLength && this.lastAvailableDate == null) {
                    var dayAgenda = agenda[i++];
                    if(date.getDate() < dayAgenda.day) {
                        this.nextMonthEnabled = false;
                        if(!dayAgenda.available || isNaN(dayAgenda.bookings[0].sHour)) {
                            this.lastAvailableDate = new Date(date.getFullYear(), date.getMonth(), dayAgenda.day - 1, lastAvailableHour, lastAvailableMin, 0);
                        } else {
                            this.lastAvailableDate = new Date(date.getFullYear(), date.getMonth(), dayAgenda.day, 0, 0, 0);
                            this.lastAvailableDate = new Date(this.lastAvailableDate.getTime() + (dayAgenda.bookings[0].sHour*60 + dayAgenda.bookings[0].sMin - pauseMinutes)*60*1000);
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
                            var booking = dayAgenda.bookings[t++];
                            if(isNaN(booking.sHour)) {
                                continue;
                            }
                            var bookingTime = new Date(dayInMillis + (booking.sHour*60 + booking.sMin - pauseMinutes)*60*1000);
                            if(date < bookingTime) {
                                this.nextMonthEnabled = false;
                                this.lastAvailableDate = bookingTime;
                                break;
                            }
                            if(date === bookingTime) {
                                alert("error");
                            }
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
                        this.firstAvailableTime.setDate(this.firstAvailableTime.getDate() + 1);
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
                    var booking = dayAgenda.bookings[i++];
                    if(!isNaN(booking.sHour)) {
                        bookingTime = new Date(bookingTime.getTime() + (booking.sHour*60 + booking.sMin - pauseMinutes)*60*1000);
                        if(this.firstAvailableTime < bookingTime) {
                            return;
                        }
                    }
                    if(isNaN(booking.eHour)) {
                        this.firstAvailableTime.setDate(this.firstAvailableTime.getDate() + 1);
                        this.firstAvailableTime.setHours(firstAvailableHour);
                        this.firstAvailableTime.setMinutes(firstAvailableMin);
                        return;
                    }
                    bookingTime = new Date(bookingTime.getTime() + (booking.eHour*60 + booking.eMin + pauseMinutes)*60*1000);
                    if(this.firstAvailableTime === bookingTime) {
                        return;
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
                if(hour < this.firstAvailableTime.getHours()
                    || hour == this.firstAvailableTime.getHours() && mins < this.firstAvailableTime.getMinutes()) {
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
        var dayStr = '';
        if(!isNaN(renderer.day)) {
            dayStr = dayStr + renderer.day;
        }
        return dayStr + ' ' + renderer.getMonthName().substring(0, 3)
            //toTwoChars(renderer.day) + '.' + toTwoChars(renderer.month)
            //dayStr + ' ' + renderer.getMonthName().substring(0, 3)
            + '. ' + renderer.year
            + ' ' + toTwoChars(renderer.hour) + ':' + toTwoChars(renderer.min);
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

    var createAjaxLoader = function() {
        var div = document.createElement('div');
        div.setAttribute('class', 'ajax-loader');
        var img = document.createElement('img');
        img.src = screenReaderText.siteURL + '/wp-content/plugins/sl-plugin/assets/client/images/ajax-loader.gif';
        div.appendChild(img); 
        return div;
    };

    var ensureClass = function(e, c) {
        if(e.getAttribute('class') != 'c') {
            e.setAttribute('class', c);
            e.parentElement.replaceChild(e, e);
        }
    }
  });

})(jQuery);

