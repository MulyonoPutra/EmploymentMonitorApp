import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
  name: 'appTextOverflow',
  standalone: true,
})
export class TextOverflowPipe implements PipeTransform {

  transform(value: any, limit: number): string {
    if (value?.length > limit) {
      return value.substr(0, limit) + '...';
    }
    return value;
  }

}
