import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  ExtendArray() {
    Array.prototype.clearMap = function (this: any[], callbackfn: (value: any, index: number, array: any) => unknown): any[] {
      const newArr: any[] = [];

      for (let i = 0; i < this.length; i++) {
        const value = callbackfn(this[i], i, this);
        value || value === false ? newArr.push(value) : null;
      }

      return newArr;
    };
    return this;
  }
}
