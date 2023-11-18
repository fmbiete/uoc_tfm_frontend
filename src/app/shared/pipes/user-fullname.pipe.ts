import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../models/user.dto';

@Pipe({
  name: 'userFullname',
  standalone: true,
})
export class UserFullnamePipe implements PipeTransform {
  transform(value: User): unknown {
    return `${value.Surname}, ${value.Name}`;
  }
}
