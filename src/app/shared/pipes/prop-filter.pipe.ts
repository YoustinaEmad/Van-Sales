import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'propertyFilter'
})
export class PropertyFilterPipe implements PipeTransform {
  transform(items: any[], filter: { property: string, value: any }): any[] {
    if (!items || !filter.property || !filter.value) {
      return items;
    }
    return items.filter(item => this.isPropertyMatch(item, filter.property, filter.value));
  }
  private isPropertyMatch(item: any, property: string, value: any): boolean {
    // eslint-disable-next-line no-prototype-builtins
    if (!item.hasOwnProperty(property)) {
      return false;
    }
    return item[property] === value;
  }
}

