import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Schedule } from 'primeng/primeng';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { AppoitmentService } from './services/appoiments.services';
import { Response } from '../common/response/model/response';
import { AppoitmentFormComponent } from "./form/appoitment-form.component";
import { AppGlobals } from "../common/globals/globals";
import { SpinnerComponent } from "../common/spinner/spinner.component";
import { DashBoardService } from "../dashboard/services/dashboard.services";

@Component({
    selector: 'calendar',
    templateUrl: './app/calendar/calendar.html',
    directives: [ROUTER_DIRECTIVES, SpinnerComponent, AppoitmentFormComponent]
})
export class CalendarComponent implements OnInit {
    title = 'Calendar';
    subtitle = 'Appoitments';
    response: Response;
    responseClinics: Response;

    public isRequesting: boolean = true;
    error: any;
    events: any[];
    idCLinic: number;
    clinicsWorker: any;
    clinicsOwner: any;
    clinicWorker: number = -1;
    clinicOwner: number = -1;
    viewOwnerClinic: boolean = false;

    constructor(private router: Router, private appoitmentService: AppoitmentService, private appGlobals: AppGlobals,
        private dashBoardService: DashBoardService) {
    }

    ngOnInit() {
        this.idCLinic = this.appGlobals.clinic.getValue().Id;
        this.getAppoitmentByClinicIdByEmployeeId();
        this.getClinicsWorker();
    }

    getAppoitmentByClinicIdByEmployeeId() {

        var idEmployee = -1;
        if (this.appGlobals.owner.getValue() === false)
            idEmployee = JSON.parse(localStorage.getItem('user')).Data.Employees[0].Id;

        if (this.appGlobals.roleSecretary.getValue())
            idEmployee = -1;

        this.response = new Response();
        this.appoitmentService
            .getAppoitmentByClinicIdByEmployeeId(this.idCLinic, idEmployee)
            .then(response => {
                this.response = response;
                this.getCalendar();
            })
            .catch(error => this.error = error);
    }

    getCalendar() {
        var date = new Date();
        var d = date.getDate();
        var m = date.getMonth();
        var y = date.getFullYear();

        var cId = $('#calendar'); //Change the name if you want. I'm also using thsi add button for more actions
        //Generate the Calendar

        var dataEvent = this.response.Data;

        cId.fullCalendar({
            header: {
                right: '',
                center: 'prev, title, next',
                left: ''
            },

            theme: true, //Do not remove this as it ruin the design
            selectable: true,
            selectHelper: true,
            editable: true,
            //Add Events
            events: this.response.Data,
            //On Day Select
            select: function (start, end, allDay) {
                window.location.href = '#/appoitments/-1/' + moment(start).format('DD-MM-YYYY');
            }
        });

        var isMobile = {
            Android: function () {
                return navigator.userAgent.match(/Android/i);
            },
            BlackBerry: function () {
                return navigator.userAgent.match(/BlackBerry/i);
            },
            iOS: function () {
                return navigator.userAgent.match(/iPhone|iPad|iPod/i);
            },
            Opera: function () {
                return navigator.userAgent.match(/Opera Mini/i);
            },
            Windows: function () {
                return navigator.userAgent.match(/IEMobile/i);
            },
            any: function () {
                return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
            }
        };

        if (isMobile.any()) {
            cId.fullCalendar('changeView', 'agendaDay');
        }

        //Create and ddd Action button with dropdown in Calendar header.
        var actionMenu = '<ul class="actions actions-alt" id="fc-actions">' +
            '<li class="dropdown">' +
            '<a href="" data-toggle="dropdown"><i class="md md-more-vert"></i></a>' +
            '<ul class="dropdown-menu dropdown-menu-right">' +
            '<li class="active">' +
            '<a data-view="month" href="">Vista mensual</a>' +
            '</li>' +
            '<li>' +
            '<a data-view="agendaWeek" href="">Vista semanal</a>' +
            '</li>' +
            '<li>' +
            '<a data-view="agendaDay" href="">Vista diaria</a>' +
            '</li>' +
            '</ul>' +
            '</div>' +
            '</li>';

        $(document).ready(function () {
            cId.find('.fc-toolbar').append(actionMenu);
        });

        //Event Tag Selector
        (function () {
            $('body').on('click', '.event-tag > span', function () {
                $('.event-tag > span').removeClass('selected');
                $(this).addClass('selected');
            });
        })();

        (function () {
            $('body').on('click', '.fc-event > div > div.fc-title', function () {
                var infoPatient = $(this).html();
                var data = infoPatient.split('-');
                window.location.href = '#/patiens-dashboard/' + data[1];
            });
        })();

        (function () {
            $('body').on('click', '.fc-event > div > span.fc-title', function () {
                var infoPatient = $(this).html();
                var data = infoPatient.split('-');
                window.location.href = '#/patiens-dashboard/' + data[1];
            });
        })();

        (function () {
            $('body').on('click', '.fc-event > div > span.fc-time', function () {
                var infoAppoitment = $(this).next().html();
                var data = infoAppoitment.split('-');
                window.location.href = '#/appoitments/' + data[2] + '/!';
            });
        })();


        (function () {
            $('body').on('click', '.fc-event > div > div.fc-time', function () {
                var infoAppoitment = $(this).next().html();
                var data = infoAppoitment.split('-');
                window.location.href = '#/appoitments/' + data[2] + '/!';
            });
        })();

        /*(function () {
            $('body').on('click', 'td', function () {
                var infoAppoitment = $(this).next().html();
                var data = infoAppoitment.split('-');
                window.location.href = '#/appoitments/' + data[2] + '/!';
            });
        })();*/


        //Add new Event
        $('body').on('click', '#addEvent', function () {
            var eventName = $('#eventName').val();
            var tagColor = $('.event-tag > span.selected').attr('data-tag');

            if (eventName != '') {
                //Render Event
                $('#calendar').fullCalendar('renderEvent', {
                    title: eventName,
                    start: $('#getStart').val(),
                    end: $('#getEnd').val(),
                    allDay: true,
                    className: tagColor

                }, true); //Stick the event

                /*$('#addNew-event form')[0].reset()*/
                $('#addNew-event').modal('hide');
            }

            else {
                $('#eventName').closest('.form-group').addClass('has-error');
            }
        });

        //Calendar views
        $('body').on('click', '#fc-actions [data-view]', function (e) {
            e.preventDefault();
            var dataView = $(this).attr('data-view');

            $('#fc-actions li').removeClass('active');
            $(this).parent().addClass('active');
            cId.fullCalendar('changeView', dataView);
        });

        this.isRequesting = false;
    }

    getClinicsWorker() {
        let idEmploye = (JSON.parse(localStorage.getItem('user')).Data.Employees.length > 0 ? JSON.parse(localStorage.getItem('user')).Data.Employees[0].Id : -1);
        if (idEmploye != -1) {
            this.dashBoardService
                .getGetClinicsByEmployeeId(idEmploye)
                .then(respon => {
                    this.responseClinics = respon;
                    this.clinicsWorker = this.responseClinics.Data;
                    this.isRequesting = false;
                })
                .catch(error => this.error = error);
        }
    }

    selectClinicWorker(value) {
        this.idCLinic = value != "-1" ? value : this.appGlobals.clinic.getValue().Id;
        this.isRequesting = true;
        this.getAppoitmentByClinicIdByEmployeeId();
    }

}

