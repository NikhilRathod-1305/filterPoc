import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonService } from '../common.service';
import { AngularCsv } from 'angular-csv-ext/dist/Angular-csv';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
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
  @Output() filtersApplied: EventEmitter<any[]> = new EventEmitter<any[]>();

  constructor(private service: CommonService) { }

  ngOnInit(): void {
    this.service.getData().subscribe(data => {
      this.data = data;
      this.extractFilterOptions();
      this.filtersApplied.emit(data);
    });
    console.log(this.filteredData);
  }

  private extractFilterOptions(): void {
    this.projects = this.extractUniqueValues('projects');
    this.types = this.extractUniqueValues('type');
    this.status = this.extractUniqueValues('status');
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
          (this.selectedProjects.length === 0 || this.selectedProjects.includes(item.projects[0])) &&
          (this.selectedTypes.length === 0 || this.selectedTypes.includes(item.type)) &&
          (this.selectedStatus.length === 0 || this.selectedStatus.includes(item.status))
        ) {

          const flattenedData = {
            id: item.id,
            name: item.name,
            phoneNumber: item.phoneNumber,
            email: item.email,
            projects: Array.isArray(item.projects) ? item.projects.join(', ') : item.projects,
            type: item.type,
            status: item.status
          };

          this.filteredData.push(flattenedData);
        }
      });
    }
    else {
      // If no filters are selected, display all data
      this.filteredData = this.data.map((item) => ({
        id: item.id,
        name: item.name,
        phoneNumber: item.phoneNumber,
        email: item.email,
        projects: Array.isArray(item.projects) ? item.projects.join(', ') : item.projects,
        type: item.type,
        status: item.status,
      }));
    }
    this.filtersApplied.emit(this.filteredData);
    console.log(this.filteredData);
  }

  private getHeaders(): string[] {
    return ['id', 'name', 'phoneNumber', 'email', 'projects', 'type', 'status'];
  }

  downloadCSV(): void {
    const headers = this.getHeaders();
    new AngularCsv([headers, ...this.filteredData], 'filtered_data');
  }

  downloadExcel(): void {
    const headers = this.getHeaders();
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([...this.filteredData]);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'projects.xlsx');
  }
}
