import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { CustomPaginatorIntl } from '../../helpers/custom-paginator-intl/custom-paginator-intl.component';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  providers: [{ provide: MatPaginatorIntl, useClass: CustomPaginatorIntl }]
})

export class TableComponent implements OnChanges {
  @ViewChild(MatSort) sort!: MatSort;
  @Input() data: any[] = [];
  @Input() filterExpanded :any;
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(private changeDetectorRef: ChangeDetectorRef) { }
  pageLength!: number;
  displayedColumns: string[] = ['id', 'name', 'phoneNumber', 'email', 'projects', 'type', 'tag', 'status', 'initiatedDate'];
  @ViewChild(MatTable) table!: MatTable<any>;
  displayToolTip:boolean=false;
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
    return columnName.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase();
  }

  formattedColumns: string[] = this.displayedColumns.map(column => this.formatColumnName(column));

}
