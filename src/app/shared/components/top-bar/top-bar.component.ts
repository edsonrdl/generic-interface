import { CommonModule } from '@angular/common';
import { Component,signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { StyleClassModule  } from 'primeng/styleclass';
import { LayoutService } from '../../components/service/layout.service';

@Component({
  selector: 'app-top-bar',
    standalone: true,
    imports: [RouterModule,CommonModule,StyleClassModule ],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.scss'
})
export class TopBarComponent {

  items!: MenuItem[];

    constructor(public layoutService: LayoutService) {}

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
    }

}
