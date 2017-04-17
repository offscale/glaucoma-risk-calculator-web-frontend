import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MsAuthComponent } from './ms-auth.component';

describe('MsAuthComponent', () => {
  let component: MsAuthComponent;
  let fixture: ComponentFixture<MsAuthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MsAuthComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MsAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
