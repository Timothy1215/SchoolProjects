import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { PlayComponent } from './play/play.component';


const routes: Routes = [
  { path: '', redirectTo: 'wordgame', pathMatch: 'full' },
  { path: 'wordgame', component : LoginComponent},
  { path: 'wordgame/api/v2/home', component : HomeComponent},
  { path: 'wordgame/api/v2/play', component : PlayComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
