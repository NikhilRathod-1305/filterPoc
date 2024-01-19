import { Injectable } from "@angular/core";
import { MatPaginatorIntl } from "@angular/material/paginator";
import { Subject } from "rxjs";

@Injectable()
export class CustomPaginatorIntl {
  changes = new Subject<void>();

  firstPageLabel= 'First Page';
  lastPageLabel = 'Last Page';
  itemsPerPageLabel = 'Records per page :';
  nextPageLabel = 'Next page';
  previousPageLabel = 'Previous page';
  getRangeLabel = (page: number, pageSize: number, length: number) => {
    const total = Math.ceil(length / pageSize);
   let total2 = total;
   if(total2 === 0){
    page=-1;
   }
    return `Page ${page + 1} of ${total}`;
  };
}