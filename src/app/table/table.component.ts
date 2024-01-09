import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
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
  dataSource2: MatTableDataSource<any> | null | undefined;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private changeDetectorRef: ChangeDetectorRef) { }

  displayedColumns: string[] = ['id', 'name', 'phoneNumber', 'email', 'projects', 'type', 'status', 'tag', 'initiatedDate'];

  formatColumnName(columnName: string): string {
    // Replace camelCase with words separated by spaces
    return columnName.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase();
  }
  formattedColumns: string[] = this.displayedColumns.map(column => this.formatColumnName(column));

  ngOnChanges(): void {
    this.initializeDataSource();
  }

  ngAfterViewInit(): void {
    this.initializeDataSource();
    this.initializeSorting();
    this.changeDetectorRef.detectChanges();
  }

  private initializeDataSource(): void {
    this.dataSource = new MatTableDataSource<any>(this.data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private initializeSorting(): void {
    this.sort.sort({
      id: 'initiatedDate',
      start: 'desc',
      disableClear: true
    });
  }
}
