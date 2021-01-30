import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosToolbarComponent } from './pos-toolbar.component';

describe('PosToolbarComponent', () => {
  let component: PosToolbarComponent;
  let fixture: ComponentFixture<PosToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosToolbarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PosToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
