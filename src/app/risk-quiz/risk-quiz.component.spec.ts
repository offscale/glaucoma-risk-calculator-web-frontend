/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RiskQuizComponent } from './risk-quiz.component';

describe('RiskQuizComponent', () => {
  let component: RiskQuizComponent;
  let fixture: ComponentFixture<RiskQuizComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RiskQuizComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskQuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
