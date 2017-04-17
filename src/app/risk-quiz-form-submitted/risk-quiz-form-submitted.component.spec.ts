import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskQuizFormSubmittedComponent } from './risk-quiz-form-submitted.component';

describe('RiskQuizFormSubmittedComponent', () => {
  let component: RiskQuizFormSubmittedComponent;
  let fixture: ComponentFixture<RiskQuizFormSubmittedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RiskQuizFormSubmittedComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskQuizFormSubmittedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
