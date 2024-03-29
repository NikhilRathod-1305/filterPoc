import { Component, OnInit } from '@angular/core';
import { CommonService } from './common/services/common.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'filterPoc';
  filteredTableData: any[] = [];
  updateFilteredTableData(filteredData: any[]): void {
    // Update the filteredTableData property when filters are applied
    this.filteredTableData = filteredData;
  }
}
