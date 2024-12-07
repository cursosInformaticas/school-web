import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditAsistenciaComponent } from './add-edit-asistencia.component';

describe('AddEditAsistenciaComponent', () => {
  let component: AddEditAsistenciaComponent;
  let fixture: ComponentFixture<AddEditAsistenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditAsistenciaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditAsistenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
