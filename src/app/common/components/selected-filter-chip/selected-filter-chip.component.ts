import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-selected-filter-chip',
  templateUrl: './selected-filter-chip.component.html',
  styleUrls: ['./selected-filter-chip.component.scss']
})
export class SelectedFilterChipComponent {
  @Input() label: string = '';
  @Input() removable: boolean = true;
  @Input() backgroundColor: string = '';
  @Output() removeFilter: EventEmitter<void> = new EventEmitter<void>();

  onRemoveFilter(): void {
    this.removeFilter.emit();
  }
}
