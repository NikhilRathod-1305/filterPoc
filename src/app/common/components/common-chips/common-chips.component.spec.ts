import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonChipsComponent } from './common-chips.component';

describe('CommonChipsComponent', () => {
  let component: CommonChipsComponent;
  let fixture: ComponentFixture<CommonChipsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CommonChipsComponent]
    });
    fixture = TestBed.createComponent(CommonChipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
