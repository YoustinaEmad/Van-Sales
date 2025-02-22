import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone:true,
  name:'num'
})
export class NumberPipe implements PipeTransform {

  transform(value: number,digit:number): string {
    return (Math.floor(value*(Math.pow(10,digit)))/(Math.pow(10,digit))).toString()
  }

}
