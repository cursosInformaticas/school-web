import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditHorarioComponent } from './add-edit-horario.component';

describe('AddEditHorarioComponent', () => {
  let component: AddEditHorarioComponent;
  let fixture: ComponentFixture<AddEditHorarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditHorarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditHorarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
