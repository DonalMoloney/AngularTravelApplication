import { Injectable } from '@angular/core';

export interface CurrencyInterface {
  base: string;
  date: string;
  rates: string;
  sucess: string;
  timestamp: number;
}

// @Injectable()
// export abstract class TodoListService {
//   /**
//    * Returns a list of all of the current user's todos.
//    */
//   abstract getTodos(): Todo[];
// }
