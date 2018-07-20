import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskResComponent } from './risk-res.component';

describe('RiskResComponent', () => {
  let component: RiskResComponent;
  let fixture: ComponentFixture<RiskResComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RiskResComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskResComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
