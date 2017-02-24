import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailTplComponent } from './email-tpl.component';

describe('EmailTplComponent', () => {
  let component: EmailTplComponent;
  let fixture: ComponentFixture<EmailTplComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailTplComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailTplComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
