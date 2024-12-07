import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditMaestroComponent } from './add-edit-maestro.component';

describe('AddEditMaestroComponent', () => {
  let component: AddEditMaestroComponent;
  let fixture: ComponentFixture<AddEditMaestroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditMaestroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditMaestroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
