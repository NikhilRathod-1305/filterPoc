import { Component, EventEmitter, Output} from "@angular/core";
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: "app-search-filter",
  templateUrl: "./search-filter.component.html",
  styleUrls: ["./search-filter.component.scss"],
})
export class SearchFilterComponent {
  @Output() searchChanged: EventEmitter<string> = new EventEmitter<string>();
  searchTerm$ = new Subject<string>();
  searchTerm: string = '';
  constructor() {
  }
  ngOnInit():void{
    this.searchTerm$
    .pipe(
      debounceTime(500),
      distinctUntilChanged()
    )
    .subscribe(() => this.searchChanged.emit(this.searchTerm));
  }

  onSearch(): void {
      this.searchTerm$.next(this.searchTerm);
  }

  searchClearAll(){
    this.searchTerm = '';
    this.onSearch();
  }
}
