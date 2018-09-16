import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptionsArgs, ConnectionBackend, RequestOptions, Response } from '@angular/http';
import { RuntimeCompiler } from '@angular/compiler';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class NotificationMessage {

    notifySuccess(title) {
        var nFrom = $(this).attr('data-from');
        var nAlign = $(this).attr('data-align');
        var nIcons = $(this).attr('data-icon');
        var nType = 'success';
        var nAnimIn = $(this).attr('data-animation-in');
        var nAnimOut = $(this).attr('data-animation-out');
        var message = ": Acci&oacute;n ejecutada correctamente";
        this.notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut, title, message);
    }

    notify(from, align, icon, type, animIn, animOut, title, message) {
        $.growl({
            icon: icon,
            title: title,
            message: message,
            url: ''
        }, {
                element: 'body',
                type: type,
                allow_dismiss: true,
                placement: {
                    from: from,
                    align: align
                },
                offset: {
                    x: 20,
                    y: 85
                },
                spacing: 10,
                z_index: 1031,
                delay: 2500,
                timer: 1000,
                url_target: '_blank',
                mouse_over: false,
                animate: {
                    enter: animIn,
                    exit: animOut
                },
                icon_type: 'class',
                template: '<div data-growl="container" class="alert" role="alert">' +
                '<button type="button" class="close" data-growl="dismiss">' +
                '<span aria-hidden="true">&times;</span>' +
                '<span class="sr-only">Close</span>' +
                '</button>' +
                '<span data-growl="icon"></span>' +
                '<span data-growl="title"></span>' +
                '<span data-growl="message"></span>' +
                '<a href="#" data-growl="url"></a>' +
                '</div>'
            });
    };

   /* notifyDelete() {
        swal({
            title: "¿Estás seguro?",
            text: "¡No podrás recuperar este elemento!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Si, quiero eliminarlo",
            closeOnConfirm: false
        }, function () {
            swal("Eliminado!", "Su elemento ha sido eliminado.", "success");
        });
    }*/

    notifyDelete(): Promise<boolean> {

        return new Promise<boolean>((resolve, reject) => {
            swal({
                title: "Seguro desea eliminar el elemento?",
                text: "No podras recuperar este elemento!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Si, quiero eliminarlo",
                closeOnConfirm: false
            }, function (isConfirm) {
                if (isConfirm) {
                    resolve(true);
                    swal("Eliminado!", "Su elemento ha sido eliminado.", "success");
                }
                else {
                    reject();
                }
            });
        });
    }

    
}

