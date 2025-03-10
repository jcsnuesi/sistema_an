import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AspirantesService } from '../../service/aspirantes.service';
import { MessageService } from 'primeng/api';
import { PDFDocument } from 'pdf-lib';
import { DialogModule } from 'primeng/dialog';
import { globalUrl } from '../../service/global.url';
import { ImportsModule } from '../primeNG.module';
import { ConfirmationService } from 'primeng/api';
import { Table } from 'primeng/table';

@Component({
    selector: 'app-solicitudes-entrantes',
    imports: [DialogModule, FormsModule, CommonModule, ImportsModule],
    providers: [AspirantesService, MessageService, ConfirmationService],
    templateUrl: './solicitudes-entrantes.component.html',
    styleUrl: './solicitudes-entrantes.component.css'
})
export class SolicitudesEntrantesComponent implements OnInit {
    public nuevasSolicitudes: any[] = [];
    public searchValue: string = '';
    @ViewChild('dt2') dt2!: Table;
    public token: string;
    public url: string;
    public optionEstado: Array<{ label: string; value: string }> = [
        { label: 'Procesada', value: 'Procesada' },
        { label: 'Requiere Edición', value: 'Requiere Edición' }
    ];
    public messageObservaciones: Array<{ comentario: string; fecha_hora: string; staffId: number }> = [];
    public dataAspirante: { id: string; foto: string } = { id: '', foto: '' };
    public estadoSelected: { label: string; value: string } = { label: '', value: '' };
    value: string = '';
    constructor(
        private _aspirantesService: AspirantesService,
        private _messageService: MessageService,
        private _confirmationService: ConfirmationService
    ) {
        this.nuevasSolicitudes = [];
        this.token =
            'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjb3JyZW9faW5zdGl0dWNpb25hbCI6InRlY25vbG9naWFAYWNhZGVtaWEuY29tIiwibm9tYnJlcyI6IkhlY3RvciIsImFwZWxsaWRvcyI6IlNhbnRvcyIsInJvbGUiOnsiaWQiOjEsInJvbGVfbmFtZSI6IlNVUEVSX0FETUlOIiwicGVybWlzb3MiOiJcIkNSRUFURSwgUkVBRCwgVVBEQVRFLCBERUxFVEVcIiJ9LCJpYXQiOjE3NDE0NzAxODksImV4cCI6MTc0MTU1NjU4OX0.ucUSxhkohBmcgqX5QX8XfvK3QVnJb9L_qgC5QFBS_Fc';
        this.url = globalUrl.url;
    }

    ngOnInit(): void {
        this.getSolicitudes();
        setInterval(() => {
            this.getSolicitudes();
        }, 50000);
    }

    clear(table: Table) {
        table.clear();
        this.searchValue = '';
    }

    applyGlobalFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dt2?.filterGlobal(filterValue, 'contains');
    }

    getSolicitudes() {
        this._aspirantesService.getNuevosAspirantes(this.token).subscribe({
            next: (response: any) => {
                if (response.status == 'success') {
                    this.nuevasSolicitudes = response.message.map((solicitud: any) => {
                        return {
                            codigo_aspirante: solicitud.fact_aspirantes[0].codigo_sistema,
                            fullname: solicitud.nombres + ' ' + solicitud.apellidos,
                            group: solicitud.fact_aspirantes[0].grupo,
                            edad: solicitud.f_nacimiento ? new Date().getFullYear() - new Date(solicitud.f_nacimiento).getFullYear() : 0,
                            estatus_solicitud: solicitud.fact_aspirantes[0].estatus_solicitud,
                            data: solicitud
                        };
                    });
                }
            },
            error: (error: any) => {
                console.log(error);
            }
        });
    }
    getSeverity(severity: any) {
        if (severity == 'En Proceso') {
            return 'info';
        } else if (severity == 'Requiere Edición') {
            return 'warn';
        }
        return 'success';
    }

    async verSolicitud(solicitud: any) {
        if (!solicitud) {
            alert('Por favor, selecciona un registro.');
            return;
        }

        // Cargar el PDF base desde assets
        const url = '/assets/formulario_base_unade_editable.pdf';
        const existingPdfBytes = await fetch(url).then((res) => res.arrayBuffer());

        // Cargar el PDF en pdf-lib
        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        const form = pdfDoc.getForm();
        const fields = form.getFields();

        fields.forEach((field) => console.log(field.getName()));

        // Llenar los campos del formulario
        form.getTextField('Text1').setText(solicitud.apellidos);
        form.getTextField('Text4').setText(solicitud.nombres);
        form.getTextField('Text5').setText(solicitud.f_nacimiento);
        form.getTextField('Text6').setText(solicitud.lugar_nacimiento);
        form.getTextField('Text7').setText(solicitud.nacionalidad);
        form.getTextField('Text8').setText(solicitud.dir_provincia);
        form.getTextField('Text9').setText(solicitud.dir_municipio);
        form.getTextField('Text10').setText(solicitud.dir_sector);
        form.getTextField('Text11').setText(solicitud.estado_civil);
        form.getTextField('Text12').setText(solicitud.cedula);
        form.getTextField('Text13').setText(solicitud.dir_calle);
        form.getTextField('Text14').setText(solicitud.celular);
        form.getTextField('Text15').setText('809-555-5555');
        form.getTextField('Text18').setText(solicitud.discapacidad ?? 'No');
        form.getTextField('Text21').setText(solicitud.email);
        if (solicitud.ocupacion == 'Militar') {
            form.getTextField('Text22').setText('X');
        } else if (solicitud.ocupacion == 'Civil') {
            form.getTextField('Text23').setText('X');
        } else {
            form.getTextField('Text24').setText('X');
        }
        form.getTextField('Text25').setText(solicitud.alergico ?? 'No');

        if (solicitud.genero == 'Masculino') {
            form.getTextField('Text26').setText('X');
        } else {
            form.getTextField('Text27').setText('X');
        }
        form.getTextField('Text28').setText(solicitud.rango ?? 'NA');
        form.getTextField('Text29').setText(solicitud.institucion_militar ?? 'NA');
        form.getTextField('Text30').setText(solicitud.fecha_ingreso ?? 'NA');
        form.getTextField('Text31').setText(solicitud.fecha_ultimo_ascenso ?? 'NA');
        form.getTextField('Text32').setText(solicitud.escuela);

        if (solicitud.sector_educativo == 'Publico') {
            form.getTextField('Text33').setText('X');
        } else {
            form.getTextField('Text34').setText('X');
        }
        form.getTextField('Text36').setText('Guardiamarina');
        form.getTextField('Text37').setText(solicitud.nombre_padre + ' ' + solicitud.apellido_padre);
        form.getTextField('Text38').setText(solicitud.nombre_madre + ' ' + solicitud.apellido_madre);
        form.getTextField('Text40').setText(solicitud.telefono_madre ?? solicitud.telefono_padre);

        // Guardar el PDF modificado
        const pdfBytes = await pdfDoc.save();
        // Descargar el PDF
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        // Abrir en nueva pestaña
        // Crear URL del blob
        const pdfUrl = URL.createObjectURL(blob);
        window.open(pdfUrl, '_blank');
    }

    updateEstado() {
        this._confirmationService.confirm({
            message: '¿Estás seguro de realizar esta accion?',
            header: 'Confirmación',
            icon: 'pi pi-exclamation-triangle',
            acceptButtonStyleClass: 'p-button-contrast',
            rejectButtonStyleClass: 'p-button-secondary',
            accept: () => {
                this._aspirantesService.updateSolicitud(this.token, this.estadoSelected.value, this.dataAspirante.id).subscribe({
                    next: (response: any) => {
                        if (response.status == 'success') {
                            this.getSolicitudes();
                            this._messageService.add({ severity: 'success', summary: 'Estado actualizado', detail: 'El estado de la solicitud ha sido actualizado.' });
                            this.editarDialog = false;
                        }
                    },
                    error: (error: any) => {
                        console.log(error);
                    }
                });
            },
            reject: () => {
                this._messageService.add({ severity: 'info', summary: 'Edición cancelada', detail: 'La edición ha sido cancelada.' });
            }
        });
    }

    confirmarHabilitarEdicion(data: any) {
        this._confirmationService.confirm({
            message: '¿Estás seguro de habilitar la edición de la solicitud?',
            header: 'Confirmación',
            icon: 'pi pi-exclamation-triangle',
            acceptButtonStyleClass: 'p-button-warn',
            rejectButtonStyleClass: 'p-button-secondary',
            accept: () => {
                this.dataAspirante.id = data.id;
                this.dataAspirante.foto = data.foto;
                this.editarSolicitud();
            },
            reject: () => {
                this._messageService.add({ severity: 'info', summary: 'Edición cancelada', detail: 'La edición ha sido cancelada.' });
            }
        });
    }

    editarDialog: boolean = false;
    editarSolicitud() {
        this.editarDialog = true;
        this.messageObservaciones = [];
        this._aspirantesService.getObservacionesById(this.token, this.dataAspirante.id).subscribe({
            next: (response: any) => {
                if (response.status == 'success') {
                    for (let i = 0; i < response.message.length; i++) {
                        this.messageObservaciones.push({ comentario: response.message[i].observacion, fecha_hora: new Date(response.message[i].fecha_creacion).toLocaleString(), staffId: response.message[i].staff_id });
                    }
                }
            },
            error: (error: any) => {
                console.log(error);
            }
        });
    }

    enviarObservacion() {
        this.messageObservaciones.push({ comentario: this.value, fecha_hora: new Date().toLocaleString(), staffId: 3 });

        let dataToSend = { id: this.dataAspirante.id, observaciones: this.value, staff_id: 3 };
        this.value = '';
        this._aspirantesService.solicitarEdicion(dataToSend, this.token).subscribe({
            next: (response: any) => {
                if (response.status == 'success') {
                    this.getSolicitudes();
                    this._messageService.add({ severity: 'success', summary: 'Observación enviada', detail: 'La observación ha sido enviada.' });
                    this.value = '';
                }
            },
            error: (error: any) => {
                console.log(error);
            }
        });
    }
}
