import { Routes } from '@angular/router';
import { LogComponent } from './components/log/log.component';
export const routes: Routes = [
    {
        //path:'', redirectTo:'/login', pathMatch:'full',
        //canActivate:[authGuard]
       path:'', redirectTo:'/vortex-streaming', pathMatch:'full'
    },
 {
        path:'vortex-streaming',component:LogComponent,
    }
];