import { Component, EventEmitter, Input, Output } from '@angular/core';

interface Chip {
  label: string;
  removable?: boolean;
  icon?: string;
}
@Component({
  selector: 'app-common-chips',
  templateUrl: './common-chips.component.html',
  styleUrls: ['./common-chips.component.scss']
})
export class CommonChipsComponent {
@Input() status: string = '';
  @Input() icon: string = '';
  @Input() count: number = 0;
  @Input() isSelected: boolean = false;
  @Input() backgroundColor: string = ''; // Add this
  @Input() textColor: string = ''; // Add this
  @Input() iconColor: string = ''; // Add this
  @Output() chipClicked: EventEmitter<void> = new EventEmitter<void>();
  @Input() styles: { backgroundColor: string; textColor: string; iconColor: string } = {
    backgroundColor: '',
    textColor: '',
    iconColor: ''
  };

  onChipClick(): void {
    this.chipClicked.emit();
  }
}
