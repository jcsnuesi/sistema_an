import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FluidModule } from 'primeng/fluid';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { CommonModule } from '@angular/common';
import { PanelModule } from 'primeng/panel';
import { FileUploadModule } from 'primeng/fileupload';
import { AspirantesService } from '../../service/aspirantes.service';
import { MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { ActivatedRoute } from '@angular/router';
import { globalUrl } from '../../service/global.url';
import { TagModule } from 'primeng/tag';

type Solicitud = {
    nombres: string;
    apellidos: string;
    f_nacimiento: string;
    lugar_nacimiento: string;
    nacionalidad: string;
    provincia: string;
    municipio: string;
    estado_civil: string;
    cedula: string;
    dir_calle: string;
    dir_sector: string;
    dir_provincia: string;
    dir_municipio: string;
    telefono?: string;
    celular: string;
    email: string;
    ocupacion: string;
    genero: string;
    escuela: string;
    sector_educativo: string;
    programa_al_que_aspira: string;
    nombre_madre: string;
    apellido_madre: string;
    telefono_madre: string;
    nombre_padre: string;
    apellido_padre: string;
    telefono_padre?: string;
    foto?: string;
    anioAplicacion?: string;
    fechaSolicitud: Date;
    estado: string;
    tipoSolicitud?: string;
    descripcion?: string;
    documentos?: string[];
    discapacidad?: string;
    discapacidad_detalle?: string;
    alergico?: string;
    rango?: string;
    institucion_militar?: string;
    fecha_ingreso?: string;
    fecha_ultimo_ascenso?: string;
};

@Component({
    selector: 'app-consulta-solicitud',
    imports: [FormsModule, ButtonModule, CommonModule, FluidModule, InputTextModule, SelectModule, TextareaModule, PanelModule, InputMaskModule, FileUploadModule, ToastModule, ConfirmDialogModule, CardModule, TagModule],
    encapsulation: ViewEncapsulation.None,
    providers: [AspirantesService, MessageService, ConfirmationService],
    templateUrl: './consulta-solicitud.component.html',
    styleUrl: './consulta-solicitud.component.css'
})
export class ConsultaSolicitudComponent implements OnInit {
    public solicitud: Solicitud;
    dropdownItems: any[] = [];
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
    public codigo_aspirante: string | null;
    public grupo: string | null;
    public cedulaAspirante: string = '';
    public url: string;
    public estatus_solicitud_update: string = 'Requiere Edición';
    public loginVisible: boolean = false;

    constructor(
        private _aspirantesService: AspirantesService,
        private _messageService: MessageService,
        private _confirmationService: ConfirmationService,
        private _activatedRoute: ActivatedRoute
    ) {
        this.optionEstadoCivil = [
            { label: 'Soltero', value: 'Soltero' },
            { label: 'Casado', value: 'Casado' },
            { label: 'Divorciado', value: 'Divorciado' }
        ];
        this.optionOcupacion = [
            { label: 'Militar', value: 'Militar' },
            { label: 'Civil', value: 'Civil' },
            { label: 'Asimilado Militar', value: 'Asimilado Militar' }
        ];
        this.optionGenero = [
            { label: 'Masculino', value: 'Masculino' },
            { label: 'Femenino', value: 'Femenino' }
        ];

        this.descapasidadSelected = { label: '', value: '' };
        this.institucionesSelected = { label: '', value: '' };
        this.rangoSelected = { label: '', value: '' };
        this.ocupacionSelected = { label: '', value: '' };
        this.sectorEduSelected = { label: '', value: '' };
        this.solicitud = {
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
            fechaSolicitud: new Date(),
            estado: '',
            descripcion: '',
            discapacidad_detalle: '',
            alergico: '',
            rango: '',
            institucion_militar: '',
            fecha_ingreso: '',
            fecha_ultimo_ascenso: '',
            foto: ''
        };
        this.generoSelected = { label: '', value: '' };
        this.estadoCivilSelected = { label: '', value: '' };
        this.preview = '/assets/avatar.png';
        this.codigo_aspirante = null;
        this.grupo = null;
        this.url = globalUrl.url;
    }

    public habilitarDiscapacidad: boolean = false;
    discapacidadEvent() {
        if (this.descapasidadSelected.value === 'Si') {
            this.habilitarDiscapacidad = true;
        } else {
            this.habilitarDiscapacidad = false;
        }
    }

    ngOnInit(): void {
        this.loginVisible = true;
        this._activatedRoute.params.subscribe((params) => {
            this.cedulaAspirante = params['id'];
            this._aspirantesService.consultarSolicitud(this.cedulaAspirante).subscribe({
                next: (res) => {
                    let data = res.message;
                    this.preview = this.url + 'get-avatar/aspirantes/' + data.foto;
                    let skipColumns = ['estado_civil', 'genero', 'sector_educativo', 'ocupacion', 'estado', 'rango', 'institucion_militar', 'discapacidad', 'fechaSolicitud', 'descripcion', 'fact_aspirantes'];

                    for (const keys in this.solicitud) {
                        let key = keys as keyof Solicitud;
                        if (skipColumns.includes(key)) {
                            continue;
                        }
                        if (key === 'discapacidad' && data[key] === 'Si') {
                            this.descapasidadSelected = { label: data[key], value: data[key] };
                            continue;
                        }
                        if (key === 'fecha_ingreso') {
                            this.solicitud.fecha_ingreso = data[key];
                            continue;
                        }
                        if (key === 'fecha_ultimo_ascenso') {
                            this.solicitud.fecha_ultimo_ascenso = data[key];
                            continue;
                        }
                        this.solicitud[key] = data[key];
                    }

                    this.generoSelected = { label: data.genero, value: data.genero };
                    this.estadoCivilSelected = { label: data.estado_civil, value: data.estado_civil };
                    this.ocupacionSelected = { label: data.ocupacion, value: data.ocupacion };
                    this.institucionesSelected = { label: data.institucion_militar, value: data.institucion_militar };
                    this.rangoSelected = { label: data.rango, value: data.rango };
                    this.sectorEduSelected = { label: data.sector_educativo, value: data.sector_educativo };
                    this.descapasidadSelected = { label: data.discapacidad ?? 'No', value: data.discapacidad ?? 'No' };
                },
                error: (err) => {
                    console.log(err);
                }
            });
        });
    }
    onSubmit(form: NgForm) {
        const formData = new FormData();
        formData.append('foto', this.solicitud.foto ?? 'N/A');
        formData.append('nombres', this.solicitud.nombres);
        formData.append('apellidos', this.solicitud.apellidos);
        formData.append('genero', this.generoSelected.label);
        formData.append('f_nacimiento', this.solicitud.f_nacimiento);
        formData.append('lugar_nacimiento', this.solicitud.lugar_nacimiento);
        formData.append('nacionalidad', this.solicitud.nacionalidad);
        formData.append('estado_civil', this.estadoCivilSelected.label);
        formData.append('cedula', this.solicitud.cedula);
        formData.append('ocupacion', this.ocupacionSelected.label);
        formData.append('institucion_militar', this.institucionesSelected.label);
        formData.append('rango', this.rangoSelected.label);
        formData.append('fecha_ingreso', this.solicitud.fecha_ingreso ?? 'N/A');
        formData.append('fecha_ultimo_ascenso', this.solicitud.fecha_ultimo_ascenso ?? 'N/A');
        formData.append('alergico', this.solicitud.alergico ?? 'No');
        formData.append('discapacidad', this.descapasidadSelected.label ?? 'N/A');
        formData.append('discapacidad_detalle', this.solicitud.discapacidad_detalle ?? 'N/A');
        formData.append('telefono', this.solicitud.telefono ?? 'No Posee');
        formData.append('celular', this.solicitud.celular);
        formData.append('email', this.solicitud.email);
        formData.append('dir_calle', this.solicitud.dir_calle);
        formData.append('dir_sector', this.solicitud.dir_sector ?? 'N/A');
        formData.append('dir_municipio', this.solicitud.dir_municipio);
        formData.append('dir_provincia', this.solicitud.dir_provincia);
        formData.append('escuela', this.solicitud.escuela);
        formData.append('sector_educativo', this.sectorEduSelected.label);
        formData.append('programa_al_que_aspira', this.solicitud.programa_al_que_aspira);
        formData.append('nombre_padre', this.solicitud.nombre_padre ?? 'N/A');
        formData.append('apellido_padre', this.solicitud.apellido_padre ?? 'N/A');
        formData.append('telefono_padre', this.solicitud.telefono_padre ?? 'N/A');
        formData.append('nombre_madre', this.solicitud.nombre_madre);
        formData.append('apellido_madre', this.solicitud.apellido_madre);
        formData.append('telefono_madre', this.solicitud.telefono_madre);

        this._confirmationService.confirm({
            message: '¿Está seguro de que desea enviar la solicitud?',
            header: 'Confirmación',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this._aspirantesService.create(formData).subscribe({
                    next: (res) => {
                        console.log(res);
                        if (res.status === 'success') {
                            this._messageService.add({ severity: 'success', summary: 'Aspirante registrado', detail: 'Su solicitud ha sido enviada exitosamente!' });
                            form.reset();
                            this.preview = '/assets/avatar.png';
                            this.codigo_aspirante = res.message.fact_aspirantes[0].codigo_sistema;
                            this.grupo = res.message.fact_aspirantes[0].grupo;
                        }
                    },
                    error: (err) => {
                        console.log(err);
                    }
                });
            },
            reject: () => {
                this._messageService.add({ severity: 'info', summary: 'Cancelado', detail: 'Operación cancelada' });
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

    update() {
        const formData = new FormData();
        formData.append('foto', this.solicitud.foto ?? 'N/A');
        formData.append('nombres', this.solicitud.nombres);
        formData.append('apellidos', this.solicitud.apellidos);
        formData.append('genero', this.generoSelected.label);
        formData.append('f_nacimiento', this.solicitud.f_nacimiento);
        formData.append('lugar_nacimiento', this.solicitud.lugar_nacimiento);
        formData.append('nacionalidad', this.solicitud.nacionalidad);
        formData.append('estado_civil', this.estadoCivilSelected.label);
        formData.append('cedula', this.solicitud.cedula);
        formData.append('ocupacion', this.ocupacionSelected.label);
        formData.append('institucion_militar', this.institucionesSelected.label);
        formData.append('rango', this.rangoSelected.label);
        formData.append('fecha_ingreso', this.solicitud.fecha_ingreso ?? 'N/A');
        formData.append('fecha_ultimo_ascenso', this.solicitud.fecha_ultimo_ascenso ?? 'N/A');
        formData.append('alergico', this.solicitud.alergico ?? 'No');
        formData.append('discapacidad', this.descapasidadSelected.label ?? 'N/A');
        formData.append('discapacidad_detalle', this.solicitud.discapacidad_detalle ?? 'N/A');
        formData.append('telefono', this.solicitud.telefono ?? 'No Posee');
        formData.append('celular', this.solicitud.celular);
        formData.append('email', this.solicitud.email);
        formData.append('dir_calle', this.solicitud.dir_calle);
        formData.append('dir_sector', this.solicitud.dir_sector ?? 'N/A');
        formData.append('dir_municipio', this.solicitud.dir_municipio);
        formData.append('dir_provincia', this.solicitud.dir_provincia);
        formData.append('escuela', this.solicitud.escuela);
        formData.append('sector_educativo', this.sectorEduSelected.label);
        formData.append('programa_al_que_aspira', this.solicitud.programa_al_que_aspira);
        formData.append('nombre_padre', this.solicitud.nombre_padre ?? 'N/A');
        formData.append('apellido_padre', this.solicitud.apellido_padre ?? 'N/A');
        formData.append('telefono_padre', this.solicitud.telefono_padre ?? 'N/A');
        formData.append('nombre_madre', this.solicitud.nombre_madre);
        formData.append('apellido_madre', this.solicitud.apellido_madre);
        formData.append('telefono_madre', this.solicitud.telefono_madre);

        this._aspirantesService.update(formData).subscribe({});
    }

    public preview: string = '';
    onBasicUploadAuto(event: any) {
        const filereader = new FileReader();
        filereader.onload = (e) => {
            this.preview = filereader.result as string;
        };
        filereader.readAsDataURL(event.files[0]);
        this.solicitud.foto = event.files[0];
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
}
