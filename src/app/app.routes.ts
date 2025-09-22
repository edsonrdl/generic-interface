import { Routes } from '@angular/router';
import { LayoutComponent } from './shared/components/layout/layout.component';
import { ToDoComponent } from './features/to-do/to-do.component';

export const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', component: ToDoComponent },

        ]
    },
       { path: '**', redirectTo: '/notfound' }

];
