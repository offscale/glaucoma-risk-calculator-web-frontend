import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskPointerComponent } from './risk-pointer.component';

describe('RiskPointerComponent', () => {
  let component: RiskPointerComponent;
  let fixture: ComponentFixture<RiskPointerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RiskPointerComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskPointerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
