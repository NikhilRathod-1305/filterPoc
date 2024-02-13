import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SelectedRowService {
  private selectedRows: any[] = [];

  getSelectedRows(): any[] {
    return this.selectedRows;
  }

  setSelectedRows(rows: any[]): void {
    this.selectedRows = rows;
  }
}
