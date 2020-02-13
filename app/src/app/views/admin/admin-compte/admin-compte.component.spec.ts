import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCompteComponent } from './admin-compte.component';

describe('AdminCompteComponent', () => {
  let component: AdminCompteComponent;
  let fixture: ComponentFixture<AdminCompteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminCompteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCompteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
