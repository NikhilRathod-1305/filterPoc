import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedFilterChipComponent } from './selected-filter-chip.component';

describe('SelectedFilterChipComponent', () => {
  let component: SelectedFilterChipComponent;
  let fixture: ComponentFixture<SelectedFilterChipComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SelectedFilterChipComponent]
    });
    fixture = TestBed.createComponent(SelectedFilterChipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
