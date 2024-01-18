import { ChangeDetectorRef, Component, EventEmitter, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { AngularCsv } from 'angular-csv-ext/dist/Angular-csv';
import * as XLSX from 'xlsx';
import { MatDateRangePicker, MatDatepickerInputEvent } from '@angular/material/datepicker';
import { FormControl, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { MatSelect, MatSelectTrigger } from '@angular/material/select';
import { MatChip } from '@angular/material/chips';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent implements OnInit, OnChanges {
  data: any[] = [];
  projects: string[] = [];
  types: string[] = [];
  status: string[] = [];
  tag: string[] = [];
  initiatedDate: string[] = [];
  selectedProjects: string[] = [];
  selectedTypes: string[] = [];
  selectedStatus: string[] = [];
  selectedTags: string = '';
  filteredData: any[] = [];
  @ViewChild('picker') picker!: MatDateRangePicker<Date>;
  @Output() filtersApplied: EventEmitter<any[]> = new EventEmitter<any[]>();
  @ViewChild('dateSelect') dateSelect!: MatSelect;
  startDate: string = '';
  currentDate: string = '';
  selectedProjectsChips: string[] = [];
  selectedTypesChips: string[] = [];
  selectedStatusChips: string[] = [];
  selectedTagsChips: string[] = [];
  isFilterCardVisible: boolean = false;
  searchKey!: string;

  constructor(private service: CommonService, private cdr: ChangeDetectorRef) {
    this.handleDateFilter = this.handleDateFilter.bind(this);
  }

  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  dateFilters = [
    { label: 'Last 30 Days', value: 'last30' },
    { label: 'Last 60 Days', value: 'last60' },
    { label: 'Last 90 Days', value: 'last90' },
    { label: 'Custom', value: 'custom' },
  ];

  defaultOptionViewValue = this.dateFilters[0].label;

  selectedDateFilter: string = 'last30';
  dateRange: { start: Date | null, end: Date | null } = { start: null, end: null };



  ngOnInit(): void {
    this.service.getData().subscribe(data => {
      this.data = data;
      this.extractFilterOptions();
      this.selectedStatus = ['Ongoing'];
      this.selectedDateFilter = "last30";
      this.applyFilters();
      this.updateStatusOptionsCount();
      this.filtersApplied.emit(this.filteredData);
    });
  }
  ngOnChanges(): void {
    this.cdr.detectChanges();
    this.updateStatusOptionsCount();

  }

  private extractFilterOptions(): void {
    this.projects = this.extractUniqueValues('projects');
    this.types = this.extractUniqueValues('type');
    this.status = this.extractUniqueValues('status');
    this.initiatedDate = this.extractUniqueValues('initiatedDate');
    this.tag = this.extractUniqueValues('tag');
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


  toggleFilterCard(): void {
    this.isFilterCardVisible = !this.isFilterCardVisible;
  }

  applyFilters(): void {
    this.filteredData = [];
    if (this.selectedProjects.length > 0 || this.selectedTypes.length > 0 || this.selectedStatus.length > 0 || this.selectedTags.length > 0) {
      this.data.forEach(item => {
        if (
          (this.selectedProjects.length === 0 || this.selectedProjects.some(project => item.projects.includes(project))) &&
          (this.selectedTypes.length === 0 || this.selectedTypes.includes(item.type)) &&
          (this.selectedStatus.length === 0 || this.selectedStatus.includes(item.status)) &&
          (this.selectedTags.length === 0 || this.selectedTags.includes(item.tag))) {

          const flattenedData = {
            id: item.id,
            name: item.name,
            phoneNumber: item.phoneNumber,
            email: item.email,
            projects: Array.isArray(item.projects) ? item.projects.join(',') : item.projects,
            type: item.type,
            status: item.status,
            initiatedDate: item.initiatedDate,
            tag: item.tag
          };
          this.filteredData.push(flattenedData);
        }
      });
    }
    else {
      // If no filters are selected, display all data
      this.filteredData = [...this.data]
    }

if (this.searchKey && this.searchKey.trim() !== '') {
    const searchLower = this.searchKey.trim().toLowerCase();
    this.filteredData = this.filteredData.filter(item =>
      (item.name && item.name.toLowerCase().includes(searchLower)) ||
      (item.phoneNumber && item.phoneNumber.includes(searchLower)) ||
      (item.email && item.email.toLowerCase().includes(searchLower)) ||
      ((Array.isArray(item.projects) ? item.projects.join(', ') : item.projects) || '').toLowerCase().includes(searchLower) ||
      (item.status && item.status.toLowerCase().includes(searchLower)) ||
      (item.tag && item.tag.toLowerCase().includes(searchLower)) ||
      (item.type && item.type.toLowerCase().includes(searchLower))
    );
  }

    if (this.selectedDateFilter === 'last30' || this.selectedDateFilter === 'last60' || this.selectedDateFilter === 'last90') {
      const days = this.selectedDateFilter === 'last30' ? 30 : this.selectedDateFilter === 'last60' ? 60 : 90;
      const currentDate = new Date();
      const startDate = new Date();
      startDate.setDate(currentDate.getDate() - days);

      this.startDate = startDate.toISOString().split('T')[0];
      this.currentDate = currentDate.toISOString().split('T')[0];

      this.filteredData = this.filteredData.filter((item) => {
        const initiatedDate = new Date(item.initiatedDate);
        return initiatedDate >= startDate && initiatedDate <= currentDate;
      });

    }
    if (this.selectedDateFilter === 'custom') {
      const startDate = this.range.controls.start.value;
      console.log(startDate);

      const endDate = this.range.controls.end.value;
      console.log(endDate);


      if (startDate && endDate) {
        this.startDate = startDate.toISOString().split('T')[0];
        this.currentDate = endDate.toISOString().split('T')[0];


        this.filteredData = this.filteredData.filter(item => {
          const itemDate = new Date(item.initiatedDate);
          console.log(itemDate);
          return itemDate >= startDate && itemDate <= endDate;
        });
      }
    }


    
    // this.updateStatusOptionsCount();
    this.filtersApplied.emit(this.filteredData);
  }

  openDateRangePicker(picker: any): void {
    this.selectedDateFilter = 'custom'; 
    if (picker) {
      picker.open()
    }
  }


  getDateFilterLabel(selectedDateFilter: string): string {
    const matchingFilter = this.dateFilters.find(filter => filter.value === selectedDateFilter);
    return matchingFilter ? matchingFilter.label : '';
  }


  private updateStatusOptionsCount(): void {
    this.statusOptions.forEach(option => {
      option.count = this.data.filter(item => item.status === option.status).length;
    });
  }

  statusOptions: { status: string, count: number }[] = [
    { status: 'Ongoing', count: 0 },
    { status: 'Yet to Start', count: 0 },
    { status: 'Completed', count: 0 },
    { status: 'Failed', count: 0 },
    { status: 'Cancelled', count: 0 }

  ];

  searchConfigData = {
    isSearchIcon: true,
    placeholder: "Search",
    isSearchClearIcon: true,
    maxLengthValue: 25,
  };

  onSearchChanged(searchTerm: string): void {
    this.searchKey = searchTerm;
    this.applyFilters();
  }
  
  isSelectedStatus(statusOption: string): boolean {
    return this.selectedStatus.includes(statusOption);
  }

  toggleStatus(statusOption: string): void {
    const index = this.selectedStatus.indexOf(statusOption);
    if (index !== -1) {
      this.selectedStatus.splice(index, 1);
    } else {
      this.selectedStatus.push(statusOption);
    }
    this.applyFilters();
  }

  handleDateFilter(selectedDateData: any): void {
    console.log('Date Filter Applied:', selectedDateData);
    this.applyFilters(); 
  }

  areFiltersSelected(): boolean {
    return this.selectedProjects.length > 0 || this.selectedTypes.length > 0 || this.selectedStatus.length > 0 || this.selectedDateFilter.length > 0 || this.selectedTags.length > 0;
  }


  removeFilter(filterType: string, value: string): void {
    switch (filterType) {
      case 'project':
        this.selectedProjects = this.selectedProjects.filter(project => project !== value);
        break;
      case 'type':
        this.selectedTypes = this.selectedTypes.filter(type => type !== value);
        break;
      case 'tag':
        this.selectedTags = '';
        break;
    }
    this.applyFilters();
  }

  resetFilters(): void {
    this.selectedProjects = [];
    this.selectedTypes = [];
    this.selectedTags = '';
    // this.selectedStatus = [];
    this.selectedDateFilter = 'last30';
    this.dateRange = { start: null, end: null };
    this.range.controls['start'].setValue(null);
    this.range.controls['end'].setValue(null);
    this.applyFilters();
  }

  refreshFilters(): void {
    this.selectedProjects = [];
    this.selectedTypes = [];
    this.selectedTags = '';
    this.selectedStatus = ['Ongoing'];
    this.selectedDateFilter = 'last30';
    this.dateRange = { start: null, end: null };
    this.range.controls['start'].setValue(null);
    this.range.controls['end'].setValue(null);
    this.applyFilters();
  }


  private getHeaders(): string[] {
    return ['id', 'name', 'phoneNumber', 'email', 'projects', 'type', 'status', 'initiatedDate', 'tag'];
  }

  downloadCSV(): void {
    const headers = this.getHeaders();
    // if (this.filteredData.length === 0) {
    //   new AngularCsv([headers, ...this.data], 'filtered_data');
    // }
    // else {
      new AngularCsv([headers, ...this.filteredData], 'filtered_data');

    // }
  }

  downloadExcel(): void {
    const headers = this.getHeaders();

    // if (this.filteredData.length === 0) {
    //   const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([...this.data]);
    //   const wb: XLSX.WorkBook = XLSX.utils.book_new();
    //   XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    //   XLSX.writeFile(wb, 'all_projects.xlsx');
    // } else {
      const formattedData = this.filteredData.map(item => {
        const formattedItem = { ...item };

        // Check if projects is an array before calling join
        if (Array.isArray(item.projects)) {
          formattedItem.projects = item.projects.join(', ');
        } else {
          formattedItem.projects = item.projects.toString(); // Convert to string if not an array
        }

        return formattedItem;
      });

      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([...formattedData]);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      XLSX.writeFile(wb, 'filtered_projects.xlsx');
    }
  }

// }
