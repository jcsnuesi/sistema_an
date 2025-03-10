import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-aspirantes',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './aspirantes.component.html',
    styleUrl: './aspirantes.component.scss'
})
export class AspirantesComponent {}
