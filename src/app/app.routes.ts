import { Routes } from '@angular/router';
import { LayoutComponent } from '@form/layout/layout.component';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from '@form/login/login.component';
import { AuthRedirectGuard } from './guards/auth-redirect.guard';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    loadChildren: () => 
      import('../app/views/form/form.routes').then(x => x.pagesRoutes),

},
{
  path: 'login',
  component: LoginComponent,
  canActivate: [AuthRedirectGuard],
},
{
  path: '**',
  redirectTo: 'login',
},
];
