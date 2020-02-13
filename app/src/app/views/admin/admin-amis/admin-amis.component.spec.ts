import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAmisComponent } from './admin-amis.component';

describe('AdminAmisComponent', () => {
  let component: AdminAmisComponent;
  let fixture: ComponentFixture<AdminAmisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminAmisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminAmisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
