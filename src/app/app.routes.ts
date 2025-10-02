import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./shared/components/layout/layout.component')
      .then(m => m.LayoutComponent),
    children: [
      // {
      //   path: '',
      //   loadComponent: () => import('./features/dashboard/dashboard.component')
      //     .then(m => m.DashboardComponent)
      // },
      {
        path: 'to-do',
        loadComponent: () => import('./features/to-do/to-do.component')
          .then(m => m.ToDoComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];