import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'prependZeroPad'
})
export class PrependZeroPadPipe implements PipeTransform {
  transform(value: number): string {
    // Check if the value is a single digit, and prepend '0' if it is
    return value < 10 ? `0${value}` : `${value}`;
  }
}
