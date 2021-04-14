import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { GameComponent } from './game/game.component';
import { PlayerComponent } from './player/player.component';
import { TeamComponent } from './team/team.component';


const routes: Routes = [
  { path: '', redirectTo: 'nfl/home', pathMatch: 'full' },
  { path: 'nfl/home', component : HomeComponent},
  { path: 'nfl/game', component : GameComponent},
  { path: 'nfl/player', component : PlayerComponent},
  { path: 'nfl/team', component : TeamComponent}
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
