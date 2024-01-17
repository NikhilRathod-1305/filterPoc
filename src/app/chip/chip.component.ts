import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-chip',
  templateUrl: './chip.component.html',
  styleUrls: ['./chip.component.scss']
})
export class ChipComponent {
  @Input() chipClass: string = '';
  @Input() icon: string = '';
  @Input() text: string = '';
  @Input() count: number | undefined;
}
