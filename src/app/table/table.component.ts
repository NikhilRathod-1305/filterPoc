import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MyCustomPaginatorIntl } from '../common/helpers/my-custom-paginator-intl/my-custom-paginator-intl.component';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  providers: [{ provide: MatPaginatorIntl, useClass: MyCustomPaginatorIntl }]
})

export class TableComponent implements OnChanges {
  @ViewChild(MatSort) sort!: MatSort;
  @Input() data: any[] = [];
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(private changeDetectorRef: ChangeDetectorRef) { }
  pageLength!: number;
  displayedColumns: string[] = ['id', 'name', 'phoneNumber', 'email', 'projects', 'type', 'status', 'tag', 'initiatedDate'];
  @ViewChild(MatTable) table!: MatTable<any>;


  ngOnChanges(): void {
    this.initializeDataSource();
  }

  ngAfterViewInit(): void {
    this.initializeSorting();
    this.changeDetectorRef.detectChanges();
  }

  private initializeDataSource(): void {
    this.dataSource = new MatTableDataSource<any>(this.data);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  private initializeSorting(): void {
    this.sort.sort({
      id: 'initiatedDate',
      start: 'desc',
      disableClear: true
    });
  }

  formatColumnName(columnName: string): string {
    // Replace camelCase with words separated by spaces
    return columnName.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase();
  }

  formattedColumns: string[] = this.displayedColumns.map(column => this.formatColumnName(column));

  
}
