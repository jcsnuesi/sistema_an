import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsersService } from '../../service/users.service';
import { AspirantesService } from '../../service/aspirantes.service';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { ImportsModule } from '../primeNG.module';
import { Table } from 'primeng/table';
import { globalUrl } from '../../service/global.url';
import { PDFDocument } from 'pdf-lib';
import html2canvas from 'html2canvas';

@Component({
    selector: 'app-administrar-aspirantes',
    imports: [ImportsModule, FormsModule, CommonModule],
    providers: [UsersService, AspirantesService, ConfirmationService, MessageService],
    templateUrl: './administrar-aspirantes.component.html',
    styleUrl: './administrar-aspirantes.component.css'
})
export class AdministrarAspirantesComponent {
    public url: string;
    public optionEstado: Array<{ label: string; value: string }> = [
        { label: 'Procesada', value: 'Procesada' },
        { label: 'Requiere Edición', value: 'Requiere Edición' }
    ];
    public searchValue: string = '';
    public token: string | null;
    public aspirantes: any[] = [];
    @ViewChild('dt2') dt2!: Table;
    public aspirantesList: any[] = [];
    public editarDialog: boolean = false;
    public estadoSelected: string = '';
    public value: string = '';
    public aspirante: any;
    public optionEstadoCivil: any[];
    public optionOcupacion: any[];
    public ocupacionSelected: { label: string; value: string };
    public optionGenero: any[];
    public generoSelected: { label: string; value: string };
    public descapasidadSelected: { label: string; value: string };
    public optionDiscapacidad: [{ label: string; value: string }, { label: string; value: string }] = [
        { label: 'Si', value: 'Si' },
        { label: 'No', value: 'No' }
    ];
    public institucionesMilitaresOptions: { label: string; value: string }[] = [
        { label: 'Ejercito', value: 'Ejercito' },
        { label: 'Armada', value: 'Armada' },
        { label: 'Fuerza Aerea', value: 'Fuerza Aerea' }
    ];
    public institucionesSelected: { label: string; value: string };
    public rangosOptions: { label: string; value: string }[] = [];
    public rangoSelected: { label: string; value: string } = { label: '', value: '' };

    public sectorEduOptions: { label: string; value: string }[] = [
        { label: 'Publico', value: 'Publico' },
        { label: 'Privado', value: 'Privado' }
    ];
    public sectorEduSelected: { label: string; value: string };
    public estadoCivilSelected: { label: string; value: string };

    constructor(
        private _aspirantesService: AspirantesService,
        private _usersService: UsersService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService
    ) {
        this.token = this._usersService.gettoken();
        this.url = globalUrl.url;
        this.optionEstadoCivil = [
            { label: 'Soltero', value: 'Soltero' },
            { label: 'Casado', value: 'Casado' },
            { label: 'Divorciado', value: 'Divorciado' }
        ];
        this.optionOcupacion = [
            { label: 'Militar', value: 'Militar' },
            { label: 'Civil', value: 'civil' },
            { label: 'Asimilado Militar', value: 'asimilado militar' }
        ];
        this.optionGenero = [
            { label: 'Masculino', value: 'Masculino' },
            { label: 'Femenino', value: 'Femenino' }
        ];

        this.descapasidadSelected = { label: '', value: '' };
        this.institucionesSelected = { label: '', value: '' };
        this.rangoSelected = { label: '', value: '' };
        this.ocupacionSelected = { label: '', value: '' };
        this.generoSelected = { label: '', value: '' };
        this.estadoCivilSelected = { label: '', value: '' };
        this.sectorEduSelected = { label: '', value: '' };
        this.getAspirantesProcesados();
        this.aspirante = {
            nombres: '',
            apellidos: '',
            f_nacimiento: '',
            lugar_nacimiento: '',
            nacionalidad: 'Dominicana',
            provincia: '',
            municipio: '',
            estado_civil: '',
            cedula: '',
            dir_calle: '',
            dir_sector: '',
            dir_provincia: '',
            dir_municipio: '',
            celular: '',
            telefono: '',
            discapacidad: '',
            email: '',
            ocupacion: '',
            genero: '',
            escuela: '',
            sector_educativo: '',
            programa_al_que_aspira: 'Guardiamarina',
            nombre_madre: '',
            apellido_madre: '',
            telefono_madre: '',
            nombre_padre: '',
            apellido_padre: '',
            telefono_padre: '',
            anioAplicacion: '',
            fechaSolicitud: new Date(),
            estado: '',
            tipoSolicitud: '',
            descripcion: '',
            discapacidad_detalle: '',
            alergico: '',
            rango: '',
            institucion_militar: '',
            fecha_ingreso: '',
            fecha_ultimo_ascenso: '',
            foto: ''
        };
    }

    applyGlobalFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dt2?.filterGlobal(filterValue, 'contains');
    }

    clear(table: Table) {
        table.clear();
        this.searchValue = '';
    }

    getAspirantesProcesados() {
        this._aspirantesService.getAspirantesProcesados(this.token).subscribe({
            next: (response) => {
                this.aspirantesList = response.message.map((aspirante: any) => {
                    return {
                        fullname: aspirante.nombres + ' ' + aspirante.apellidos,
                        codigo_aspirante: aspirante.fact_aspirantes[0].codigo_sistema,
                        grupo: aspirante.fact_aspirantes[0].grupo,
                        edad: aspirante.f_nacimiento ? new Date().getFullYear() - new Date(aspirante.f_nacimiento).getFullYear() : 0,
                        estado: aspirante.fact_aspirantes[0].estatus_aspirante,
                        data: aspirante
                    };
                });
            },
            error: (error) => {
                console.log(error);
            }
        });
    }

    async verSolicitud(solicitud: any) {
        console.log('getAspirantesProcesados', solicitud.foto);
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
        // const fields = form.getFields();
        // fields.forEach((field) => console.log(field.getName()));

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
        form.getTextField('Text15').setText(solicitud.telefono);
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

        // Agregar la imagen de perfil
        const imgBytes = await fetch(this.url + 'get-avatar/aspirantes/' + solicitud.foto).then((res) => res.arrayBuffer());
        console.log('imgBytes', imgBytes);
        let ext = solicitud.foto.split('.').pop();
        const img = ext == 'jpg' ? await pdfDoc.embedJpg(imgBytes) : await pdfDoc.embedPng(imgBytes);
        const page = pdfDoc.getPage(0);
        page.drawImage(img, {
            x: 415,
            y: 650,
            width: 100,
            height: 100
        });

        // Guardar el PDF modificado
        const pdfBytes = await pdfDoc.save();
        // Descargar el PDF
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        // Abrir en nueva pestaña
        // Crear URL del blob
        const pdfUrl = URL.createObjectURL(blob);
        window.open(pdfUrl, '_blank');
    }

    ocupacionSelectedChange(): boolean {
        if (this.ocupacionSelected.value === 'militar') {
            return true;
        }
        return false;
    }

    rangosList() {
        if (this.institucionesSelected.value === 'Armada') {
            this.rangosOptions = [
                { label: 'Marinero', value: 'Marinero' },
                { label: 'Cabo', value: 'Cabo' },
                { label: 'Sargento', value: 'Sargento' },
                { label: 'Sargento Mayor', value: 'Sargento Mayor' }
            ];
        } else {
            this.rangosOptions = [
                { label: 'Raso', value: 'Raso' },
                { label: 'Cabo', value: 'Cabo' },
                { label: 'Sargento', value: 'Sargento' },
                { label: 'Sargento Mayor', value: 'Sargento Mayor' }
            ];
        }
    }
    habilitarDiscapacidad() {
        if (this.descapasidadSelected.value === 'Si') {
            return true;
        }
        return false;
    }

    getSeverity(severity: any) {
        if (severity == 'Preseleccionado') {
            return 'secondary';
        } else if (severity == 'Reserva') {
            return 'warn';
        }
        return 'danger';
    }

    editar(aspirante: any) {
        console.log(aspirante);
        this.editarDialog = true;
        this.aspirante = aspirante;
        this.ocupacionSelected = { label: aspirante.ocupacion, value: aspirante.ocupacion };
        this.generoSelected = { label: aspirante.genero, value: aspirante.genero };
        this.estadoCivilSelected = { label: aspirante.estado_civil, value: aspirante.estado_civil };
        this.descapasidadSelected = { label: aspirante.discapacidad, value: aspirante.discapacidad };
        this.institucionesSelected = { label: aspirante.institucion_militar, value: aspirante.institucion_militar };
        this.rangoSelected = { label: aspirante.rango, value: aspirante.rango };
        this.sectorEduSelected = { label: aspirante.sector_educativo, value: aspirante.sector_educativo };
        this.ocupacionSelected = { label: aspirante.ocupacion, value: aspirante.ocupacion };
    }

    public preview: string = '';
    onBasicUploadAuto(event: any) {
        const filereader = new FileReader();
        filereader.onload = (e) => {
            this.preview = filereader.result as string;
        };
        filereader.readAsDataURL(event.files[0]);
        this.aspirante.foto = event.files[0];
    }

    onSubmit(form: any) {
        console.log(this.aspirante);
    }
}
