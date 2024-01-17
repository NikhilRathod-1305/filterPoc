import { Component, EventEmitter, Input, Output } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
} from "@angular/forms";
import { EMPTY, Subscription, of } from "rxjs";

import { debounceTime, distinctUntilChanged, switchMap } from "rxjs/operators";
import { RegularExpressions } from "src/app/common/constants/regexList";

export interface ISearchConfig{
  isSearchIcon ?: boolean;
  label ?: string;
  placeholder ?: string;
  isSearchClearIcon ?: boolean;
  isShowSearchOnly?:boolean;
  action ?: Function;
  pattern ?: any;
  maxLengthValue ?:number;
}

@Component({
  selector: "app-search-filter",
  templateUrl: "./search-filter.component.html",
  styleUrls: ["./search-filter.component.scss"],
})
export class SearchFilterComponent {
  searchForm!: FormGroup;
  searchInput!: FormControl;
  @Output() formEmit = new EventEmitter<any>();
  @Input() isShowSearchOnly!: boolean;
  @Output() onKeyUpSearch = new EventEmitter<any>();
  @Output() clearSearchEvent = new EventEmitter<any>();
  @Input() searchData: any[] = [];
  @Input() searchConfig!: ISearchConfig;
  defaultRegExPattern = RegularExpressions?.globalSearchPattern;
  searchFormPresent = true;
  search=true
  private SearchSubscription!: Subscription; 
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.searchInput = this.fb.control("", []);
    this.searchForm = this.fb.group({searchInput: this.searchInput});
    if (this.isShowSearchOnly || this.searchConfig?.isShowSearchOnly) {
      this.SearchSubscription = this.searchInput.valueChanges
        .pipe(
          debounceTime(2000),
          distinctUntilChanged(),
          switchMap((search) => {
            const cleanedFilterValue = search.trim().toLowerCase(); // Clean and convert to lowercase
            return of(cleanedFilterValue);
          })
        )
        .subscribe((cleanedFilterValue) => {
          const trimmedValue = cleanedFilterValue.trim().toLowerCase(); // Remove whitespace and convert to lowercase
          if (trimmedValue.length >= 3) {
            this.handleSearch(trimmedValue);
          } else if (trimmedValue === "") {
            this.onKeyUpSearch.emit(trimmedValue);
            if (this.searchConfig?.action) {
              this.searchConfig.action(trimmedValue);
            }
          }
        });
    }
}


  private handleSearch(cleanedFilterValue: string) {
    if (this.searchConfig?.pattern) {
      const dynamicRegExPattern = this.searchConfig.pattern;
      if (dynamicRegExPattern.test(cleanedFilterValue)) {
        this.onKeyUpSearch.emit(cleanedFilterValue);
        if (this.searchConfig?.action) {
          this.searchConfig.action(cleanedFilterValue);
        }
      }
    } else {
      if (this.defaultRegExPattern.test(cleanedFilterValue)) {
        this.onKeyUpSearch.emit(cleanedFilterValue);
        if (this.searchConfig?.action) {
          this.searchConfig.action(cleanedFilterValue);
        }
      }
    }
  }

  searchFilter(filterValue: any) {
    if (this.isShowSearchOnly || this.searchConfig?.isShowSearchOnly) {
          this.searchInput.setValue(filterValue);
    }
  }
  
  searchClearAll() {
    const input = this.searchInput.value.trim()    
    // this.handleSearch("");
    if(input.length > 0){
      this.searchInput.setValue(""); 
      // this.onKeyUpSearch.emit("");
    }
  }
  ngOnDestroy(): void {
    if (this.SearchSubscription) {
      this.SearchSubscription.unsubscribe();
    }
  }
}
