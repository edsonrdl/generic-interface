import { Routes } from '@angular/router';
import { LayoutComponent } from './shared/components/layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
    
      {
        path: 'to-do',
       loadComponent: () => import('./features/to-do/to-do.component').then(c => c.ToDoComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
