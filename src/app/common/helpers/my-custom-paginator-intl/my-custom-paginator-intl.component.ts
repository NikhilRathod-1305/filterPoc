import { Injectable } from "@angular/core";
import { MatPaginatorIntl } from "@angular/material/paginator";
import { Subject } from "rxjs";

@Injectable()
export class MyCustomPaginatorIntl {
  changes = new Subject<void>();

  firstPageLabel!: string;
  lastPageLabel!: string;
  itemsPerPageLabel = 'Records per page :';
  nextPageLabel = 'Next page';
  previousPageLabel = 'Previous page';
  getRangeLabel = (page: number, pageSize: number, length: number) => {
    const total = Math.ceil(length / pageSize);
    return `Page ${page + 1} of ${total}`;
  };
}