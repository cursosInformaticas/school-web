import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditAsignaturaComponent } from './add-edit-asignatura.component';

describe('AddEditAsignaturaComponent', () => {
  let component: AddEditAsignaturaComponent;
  let fixture: ComponentFixture<AddEditAsignaturaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditAsignaturaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditAsignaturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
