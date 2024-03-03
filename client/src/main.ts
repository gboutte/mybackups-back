import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import {FormControl, FormGroup} from "@angular/forms";



declare module '@angular/forms' {
  interface FormGroup {
    updateAllValueAndValidity: (formGroup: FormGroup) => void;
  }
}

FormGroup.prototype.updateAllValueAndValidity =  (formGroup: FormGroup):void=>{
  function updateFormGroup(formGroup: FormGroup){
    Object.keys(formGroup.controls).forEach((controlKey) => {
      const control = formGroup.controls[controlKey];
      if(control instanceof FormControl){
        control.updateValueAndValidity();
      }else if(control instanceof FormGroup){
        updateFormGroup(control);
      }
    });
  }

  updateFormGroup(formGroup);

}
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
