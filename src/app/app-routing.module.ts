import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  { path: '', loadChildren: () => import('./quiz/quiz.module').then(m => m.QuizModule) },
  { path: 'results', loadChildren: () => import('./results/results.module').then(m => m.ResultsModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
