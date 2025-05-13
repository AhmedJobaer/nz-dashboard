import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketSupport2Component } from './ticket-support2.component';

describe('TicketSupport2Component', () => {
  let component: TicketSupport2Component;
  let fixture: ComponentFixture<TicketSupport2Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TicketSupport2Component]
    });
    fixture = TestBed.createComponent(TicketSupport2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
