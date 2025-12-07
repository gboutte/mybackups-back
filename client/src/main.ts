import { FormControl, FormGroup } from '@angular/forms';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppRootComponent } from './app/app-root/app-root.component';
import {appConfig} from "./app.config";

declare module '@angular/forms' {
  interface FormGroup {
    updateAllValueAndValidity: (formGroup: FormGroup) => void;
  }
}

FormGroup.prototype.updateAllValueAndValidity = (
  formGroup: FormGroup,
): void => {
  function updateFormGroup(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((controlKey) => {
      const control = formGroup.controls[controlKey];
      if (control instanceof FormControl) {
        control.updateValueAndValidity();
      } else if (control instanceof FormGroup) {
        updateFormGroup(control);
      }
    });
  }

  updateFormGroup(formGroup);
};
bootstrapApplication(AppRootComponent, appConfig)
  .catch((err) => console.error(err));
