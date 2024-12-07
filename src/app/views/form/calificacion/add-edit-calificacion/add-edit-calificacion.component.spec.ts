import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditCalificaionComponent } from './add-edit-calificacion.component';

describe('AddEditCalificaionComponent', () => {
  let component: AddEditCalificaionComponent;
  let fixture: ComponentFixture<AddEditCalificaionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditCalificaionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditCalificaionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
