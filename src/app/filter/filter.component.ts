import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { AngularCsv } from 'angular-csv-ext/dist/Angular-csv';
import * as XLSX from 'xlsx';
import { AbstractControl, FormControl, FormGroup, ValidatorFn } from '@angular/forms';
import { MatDateRangePicker, MatDatepicker, MatEndDate, MatStartDate } from '@angular/material/datepicker';
import { MatOptionSelectionChange } from '@angular/material/core';
import { MatDateRangeInput } from '@angular/material/datepicker';
import { CommonService } from '../common.service';

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
  selectedProjects: string[] = [];
  selectedTypes: string[] = [];
  selectedStatus: string[] = [];
  filteredData: any[] = [];
  maxDate!: Date
  @Output() filtersApplied: EventEmitter<any[]> = new EventEmitter<any[]>();
  @ViewChild('picker') picker!: MatDatepicker<any>;
  @ViewChild('datepicker', { static: true }) datepicker!: ElementRef;
  constructor(private service: CommonService) { }

  dateRanges = [
    { label: 'Last 30 Days', value: 'last30' },
    { label: 'Last 60 Days', value: 'last60' },
    { label: 'Last 90 Days', value: 'last90' },
    // { label: 'Custom Dates', value: 'custom' },
  ];
  selectedDateRange: string = this.dateRanges[0].value;

  selectdate = ['custom']
  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  ngOnInit(): void {
    this.service.getData().subscribe((data: any[]) => {
      this.data = data;
      this.extractFilterOptions();
      this.selectedDateRange = 'last30';
      this.applyFilters();
      this.filtersApplied.emit(this.filteredData);
      this.maxDate = new Date();
    });
  }

  public extractFilterOptions(): void {
    this.projects = this.extractUniqueValues('projects');
    this.types = this.extractUniqueValues('type');
    this.status = this.extractUniqueValues('status');
  }
  public extractUniqueValues(fieldName: string): string[] {
    const uniqueValues = new Set<string>();
    this.data.forEach((item) => {
      if (item[fieldName] instanceof Array) {
        item[fieldName].forEach((value: string) => uniqueValues.add(value));
      } else {
        uniqueValues.add(item[fieldName]);
      }
    });
    return Array.from(uniqueValues);
  }

  applyFilters(): void {
    console.log(this.range.controls.start.value)
    console.log(this.range.controls.end.value)
    console.log('Before filtering:', this.filteredData);

    this.filteredData = [];

    if (
      this.selectedProjects.length === 0 &&
      this.selectedTypes.length === 0 &&
      this.selectedStatus.length === 0
    ) {
      this.filteredData = [...this.data];
    } else {
      this.data.forEach((item) => {
        const projectMatches =
          this.selectedProjects.length === 0 ||
          (Array.isArray(item.projects) &&
            item.projects.some((project: string) => this.selectedProjects.includes(project))) ||
          (!Array.isArray(item.projects) && this.selectedProjects.includes(item.projects[0]));

        if (
          projectMatches &&
          (this.selectedTypes.length === 0 || this.selectedTypes.includes(item.type)) &&
          (this.selectedStatus.length === 0 || this.selectedStatus.includes(item.status))
        ) {
          // Flatten data before adding to filteredData
          const flattenedData = {
            id: item.id,
            name: item.name,
            phoneNumber: item.phoneNumber,
            email: item.email,
            projects: Array.isArray(item.projects)
              ? item.projects.join(', ')
              : item.projects,
            type: item.type,
            status: item.status,
            initiatedDate: item.initiatedDate,
          };

          this.filteredData.push(flattenedData);
        }
      });
      console.log('After filtering:', this.filteredData);
    }
    if (
      this.selectedDateRange === 'last30' ||
      this.selectedDateRange === 'last60' ||
      this.selectedDateRange === 'last90'
    ) {
      const days = parseInt(this.selectedDateRange.substr(4));
      const currentDate = new Date();
      const startDate = new Date(currentDate.getTime() - days * 24 * 60 * 60 * 1000);


      this.filteredData = this.filteredData.filter(
        (item) => new Date(item.date) >= startDate
      );
      console.log('After filtering seleced date:', this.filteredData);
    }

    if (this.selectedDateRange === 'custom') {
      const startDate = this.range.controls.start.value;
      console.log(startDate);

      const endDate = this.range.controls.end.value;
      console.log(endDate);
      console.log('After filtering custom:', this.filteredData);

      if (startDate && endDate) {
        this.filteredData = this.filteredData.filter((item) => {
          const itemDate = new Date(item.date);
          console.log(itemDate);
          return itemDate >= startDate && itemDate <= endDate;
        });
      }
    }

    if (this.filteredData.length > 0) {
      this.filtersApplied.emit(this.filteredData);
    } else {
      this.filtersApplied.emit([]);
    }
  }

  resetFilters(): void {
    // Reset selected filters
    this.selectedProjects = [];
    this.selectedTypes = [];
    this.selectedStatus = [];
    this.selectedDateRange = '';

    // Reset the date range form controls
    this.range.controls.start.setValue(null);
    this.range.controls.end.setValue(null);

    // Close the date range picker if it is open
    if (this.selectedDateRange === 'custom') {
      this.picker.close();
    }

    // Reset filtered data to the entire dataset
    this.filteredData = [...this.data];

    // Emit the event to show all data
    this.filtersApplied.emit(this.filteredData);
  }


  private getHeaders(): string[] {
    // Add headers based on your data structure
    return ['id', 'name', 'phoneNumber', 'email', 'projects', 'type', 'status', 'initiatedDate'];
  }

  downloadCSV(): void {
    const headers = this.getHeaders();
    const dataToDownload = this.filteredData.length === 0 ? this.data : this.filteredData;
    new AngularCsv([headers, ...dataToDownload], 'filtered_data');
  }

  downloadExcel(): void {
    try {
      console.log('Start downloadExcel');
      const headers = this.getHeaders();

      if (this.filteredData.length === 0) {
        console.log('Downloading all data');
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([...this.data]);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        XLSX.writeFile(wb, 'all_data.xlsx');
      } else {
        console.log('Downloading filtered data');
        const formattedData = this.filteredData.map((item) => {
          const formattedItem = { ...item };
          if (Array.isArray(item.projects)) {
            formattedItem.projects = item.projects.join(', ');
          } else {
            formattedItem.projects = item.projects; // or handle it in another way based on your requirements
          }

          // Format date (assuming item.date is a valid date string)
          formattedItem.date = new Date(item.date).toLocaleDateString();

          return formattedItem;
        });

        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([...formattedData]);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        XLSX.writeFile(wb, 'filtered_data.xlsx');
      }
    } catch (error) {
      console.error('Error during Excel generation:', error);
    }
  }

  openCustomDateRange(picker: any) {
    this.selectedDateRange = 'custom'; // Set the selected value to 'custom'
    if (picker) {
      picker.open()
    }
  }
}
