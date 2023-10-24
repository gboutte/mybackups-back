import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InstallComponent } from './components/install/install.component';

const routes: Routes = [
  {
    path: '',
    component: InstallComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InstallationRoutingModule {}
