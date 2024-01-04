import { DatePipe } from "@angular/common";
import { Component, EventEmitter, Input, Output, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { ThemePalette } from "@angular/material/core";
import { MatDateRangeInput } from "@angular/material/datepicker";
import * as moment from "moment";
interface filterOption {
  value: number;
  viewValue: string;
}
@Component({
  selector: "qid-date-filter",
  templateUrl: "./date-filter.component.html",
  styleUrls: ["./date-filter.component.scss"],
})
export class DateFilterComponent {

  filterOption: filterOption[] = [
    { value: 1, viewValue: "Last 30 days" },
    { value: 2, viewValue: "Last 60 days" },
    { value: 3, viewValue: "Last 90 days" },
    { value: 4, viewValue: "Custom" }
  ];
  range!: FormGroup;
  defaultOptionValue: number = 1;
  defaultOptionViewValue = this.filterOption[0].viewValue;
  formattedStartDate: any;
  formattedEndDate: any;
  dateSelected!: boolean;
  @Input() customDateConfig: any;
  @Input() globalFilterLoaded!: boolean;
  @Output() optionSelected = new EventEmitter<any>();

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.range = this.formBuilder.group({
      start: [''], // Set your pre-selected start date here
      end: [''],   // Set your pre-selected end date here
    });

    this.defaultOptionValue = this.customDateConfig?.dateValue == undefined || this.customDateConfig?.dateValue == null || this.customDateConfig?.dateValue == "" ? 1 : this.customDateConfig?.dateValue;
    this.defaultOptionViewValue = this.filterOption[this.defaultOptionValue - 1].viewValue;
    this.onSelectionChange({ value: this.defaultOptionValue, viewValue: this.defaultOptionViewValue });
    const placeholderFilterOption: filterOption = { value: 0, viewValue: 'Placeholder' };

    this.range.valueChanges.subscribe(() => {
      this.onDateRangeChange(placeholderFilterOption);
    });

    if (this.customDateConfig?.dateValue == 4) {
      this.range.patchValue({
        start: new Date(this.customDateConfig?.startDate), // Convert the start date to a Date object
        end: new Date(this.customDateConfig?.endDate),   // Convert the end date to a Date object
      });
    }

  }

  openDateRangePicker(picker: any) {
    this.defaultValueHandler();
    if (picker && picker.opened) {
      picker.close();
    } else if (picker) {
      picker.open();
    }
  }

  // Function to handle date range input change
  onDateRangeChange(option: filterOption) {
    const startDate = this.range.get("start")?.value;
    const endDate = this.range.get("end")?.value;

    this.dateSelected = startDate !== null || endDate !== null;

    this.formattedStartDate = this.convertDateTimeToNewFormat(startDate);
    this.formattedEndDate = this.convertDateTimeToNewFormat(endDate);

    // this.formattedEndDate = formattedEndDate == "Invalid date" || typeof (formattedEndDate) === null || typeof (formattedEndDate) === undefined || formattedEndDate == "" ? null : formattedEndDate;
    const selectedDateData = {
      selectedValue: 4, // custom date has value 4 
      startDate: this.formattedStartDate,
      endDate: this.formattedEndDate,
    }
    this.optionSelected.emit(selectedDateData);
    this.customDateConfig?.action(selectedDateData);

    if (typeof (this.formattedStartDate) != null && typeof (this.formattedEndDate) != null && this.formattedStartDate != null && this.formattedEndDate != null && this.formattedStartDate != "" && this.formattedEndDate != "") {
      this.optionSelected.emit(selectedDateData);
      this.customDateConfig?.action(selectedDateData);

    }
  }

  //convert to 2023-01-21 format
  convertDateTimeToNewFormat(dateTimeString: string): string {
    const date = moment(dateTimeString);
    return date.format("YYYY-MM-DD");
  }

  defaultValueHandler() {
    this.defaultOptionValue = 4;
    this.defaultOptionViewValue = this.filterOption[3]?.viewValue;
    this.dateSelected = false;
  }

  onSelectionChange(event: any) {
    this.defaultOptionValue = event?.value;
    this.defaultOptionViewValue = this.filterOption[event.value - 1]?.viewValue;
    let startDate: Date | null = null;
    const endDate = new Date();
    if (event.value === 1) {
      startDate = new Date(endDate);
      startDate.setDate(endDate.getDate() - 30);
    } else if (event.value === 2) {
      startDate = new Date(endDate);
      startDate.setDate(endDate.getDate() - 60);
    } else if (event.value === 3) {
      startDate = new Date(endDate);
      startDate.setDate(endDate.getDate() - 90); // Subtract 90 days
    }

    const formattedStartDate = startDate ? startDate.toISOString().split("T")[0] : null;
    const formattedEndDate = endDate.toISOString().split("T")[0];
    const selectedDateData = {
      selectedValue: event.value,
      startDate: formattedStartDate,
      endDate: formattedEndDate
    }

    if (typeof (formattedStartDate) != null && typeof (formattedEndDate) != null) {
      this.optionSelected.emit(selectedDateData);
      console.log(selectedDateData);

      this.customDateConfig?.action(selectedDateData);
    }
  }
}