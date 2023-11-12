import { UntypedFormControl, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  public static match(
    ctl: UntypedFormControl,
    matchCtl: UntypedFormControl
  ): ValidatorFn {
    return () => {
      let ret = null;
      if (ctl.value !== matchCtl.value) {
        ret = { matchValidator: true };
      }
      return ret;
    };
  }
}
