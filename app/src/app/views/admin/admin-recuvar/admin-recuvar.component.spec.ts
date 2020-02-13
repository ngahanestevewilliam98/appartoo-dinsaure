import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRecuvarComponent } from './admin-recuvar.component';

describe('AdminRecuvarComponent', () => {
  let component: AdminRecuvarComponent;
  let fixture: ComponentFixture<AdminRecuvarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminRecuvarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminRecuvarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
