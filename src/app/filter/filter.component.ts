import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { CommonService } from '../common.service';
import { AngularCsv } from 'angular-csv-ext/dist/Angular-csv';
import * as XLSX from 'xlsx';
import { MatDateRangePicker, MatDatepickerInputEvent } from '@angular/material/datepicker';
import { FormControl, FormGroup } from '@angular/forms';
import { DateFilterComponent } from '../date-filter/date-filter.component';
import * as moment from 'moment';
@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent implements OnInit {
  data: any[] = [];
  projects: string[] = [];
  types: string[] = [];
  status: string[] = [];
  initiatedDate: string[] = [];
  selectedProjects: string[] = [];
  selectedTypes: string[] = [];
  selectedStatus: string[] = [];
  filteredData: any[] = [];
  @ViewChild('picker') picker!: MatDateRangePicker<Date>;
  @ViewChild(DateFilterComponent) dateFilterComponent!: DateFilterComponent;

  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });


  openDateRangePicker(): void {
    if (this.picker) {
      this.picker.open();
    }
  }

  dateFilters = [
    { label: 'Last 30 Days', value: 'last30' },
    { label: 'Last 60 Days', value: 'last60' },
    { label: 'Last 90 Days', value: 'last90' },
    { label: 'Custom Range', value: 'custom' },
  ];

  selectedDateFilter: string = 'last30';
  dateRange: { start: Date | null, end: Date | null } = { start: null, end: null };

  @Output() filtersApplied: EventEmitter<any[]> = new EventEmitter<any[]>();

  constructor(private service: CommonService) {
    this.handleDateFilter = this.handleDateFilter.bind(this);
  }

  ngOnInit(): void {
    this.service.getData().subscribe(data => {
      this.data = data;
      this.extractFilterOptions();
      this.selectedDateFilter = "last30";
      this.applyFilters();
      this.filtersApplied.emit(this.filteredData);
    });
    console.log(this.filteredData);
  }

  private extractFilterOptions(): void {
    this.projects = this.extractUniqueValues('projects');
    this.types = this.extractUniqueValues('type');
    this.status = this.extractUniqueValues('status');
    this.initiatedDate = this.extractUniqueValues('initiatedDate')
  }
  private extractUniqueValues(fieldName: string): string[] {
    const uniqueValues = new Set<string>();
    this.data.forEach(item => {
      if (item[fieldName] instanceof Array) {
        item[fieldName].forEach((value: string) => uniqueValues.add(value));
      } else {
        uniqueValues.add(item[fieldName]);
      }
    });
    return Array.from(uniqueValues);
  }

  applyFilters(): void {
    this.filteredData = [];
    if (this.selectedProjects.length > 0 || this.selectedTypes.length > 0 || this.selectedStatus.length > 0) {
      this.data.forEach(item => {
        if (
          (this.selectedProjects.length === 0 || this.selectedProjects.some(project => item.projects.includes(project))) &&
          (this.selectedTypes.length === 0 || this.selectedTypes.includes(item.type)) &&
          (this.selectedStatus.length === 0 || this.selectedStatus.includes(item.status))) {

          const flattenedData = {
            id: item.id,
            name: item.name,
            phoneNumber: item.phoneNumber,
            email: item.email,
            projects: Array.isArray(item.projects) ? item.projects.join(',') : item.projects,
            type: item.type,
            status: item.status,
            initiatedDate: item.initiatedDate
          };
          this.filteredData.push(flattenedData);
        }
      });
    }
    else {
      // If no filters are selected, display all data
      this.filteredData = [...this.data]
    }

    // if (this.selectedDateFilter === 'last30' || this.selectedDateFilter === 'last60' || this.selectedDateFilter === 'last90') {
    //   const days = this.selectedDateFilter === 'last30' ? 30 : this.selectedDateFilter === 'last60' ? 60 : 90;
    //   const currentDate = new Date();
    //   const startDate = new Date();
    //   startDate.setDate(currentDate.getDate() - days);

    //   this.filteredData = this.filteredData.filter((item) => {
    //     const initiatedDate = new Date(item.initiatedDate);
    //     return initiatedDate >= startDate && initiatedDate <= currentDate;
    //   });
    // }
    // if (this.selectedDateFilter === 'custom') {
    //   const startDate = this.range.controls.start.value;
    //   console.log(startDate);

    //   const endDate = this.range.controls.end.value;
    //   console.log(endDate);


    //   if (startDate && endDate) {
    //     this.filteredData = this.filteredData.filter(item => {
    //       const itemDate = new Date(item.initiatedDate);
    //       console.log(itemDate);
    //       return itemDate >= startDate && itemDate <= endDate;
    //     });
    //   }
    // }
    if (this.dateFilterComponent && this.dateFilterComponent.dateSelected) {

      const startDate = this.dateFilterComponent.formattedStartDate;
      const endDate = this.dateFilterComponent.formattedEndDate;

      this.filteredData = this.filteredData.filter((item) => {
        const initiatedDate = moment(item.initiatedDate).format('YYYY-MM-DD');
        return (
          (!startDate || initiatedDate >= startDate) &&
          (!endDate || initiatedDate <= endDate)
        );
      });
    }

    this.filtersApplied.emit(this.filteredData);
    console.log('Filtered Data:', this.filteredData);
  }



  handleDateFilter(selectedDateData: any): void {
    // Handle date filter logic if needed
    console.log('Date Filter Applied:', selectedDateData);
    this.applyFilters(); // Trigger applying filters after date filter changes
  }


  areFiltersSelected(): boolean {
    return this.selectedProjects.length > 0 || this.selectedTypes.length > 0 || this.selectedStatus.length > 0 || this.selectedDateFilter.length > 0;
  }

  resetFilters(): void {
    this.selectedProjects = [];
    this.selectedTypes = [];
    this.selectedStatus = [];
    this.selectedDateFilter = 'last30';
    this.dateRange = { start: null, end: null };
    this.applyFilters();
  }


  private getHeaders(): string[] {
    return ['id', 'name', 'phoneNumber', 'email', 'projects', 'type', 'status', 'initiatedDate'];
  }

  downloadCSV(): void {
    const headers = this.getHeaders();
    if (this.filteredData.length === 0) {
      new AngularCsv([headers, ...this.data], 'filtered_data');
    }
    else {
      new AngularCsv([headers, ...this.filteredData], 'filtered_data');

    }
  }

  downloadExcel(): void {
    const headers = this.getHeaders();

    if (this.filteredData.length === 0) {
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([...this.data]);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      XLSX.writeFile(wb, 'all_projects.xlsx');
    } else {
      const formattedData = this.filteredData.map(item => {
        const formattedItem = { ...item };
        formattedItem.projects = item.projects.join(', ');
        return formattedItem;
      });
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([...formattedData]);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      XLSX.writeFile(wb, 'filtered_projects.xlsx');
    }
  }
}
