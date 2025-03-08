import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SolicitudesComponent } from './solicitudes/solicitudes.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [SolicitudesComponent],
    imports: [CommonModule, FormsModule],
    exports: [FormsModule],
    bootstrap: [SolicitudesComponent]
})
export class AspirantesModule {}
