import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditGradoEscolarComponent } from './add-edit-grado-escolar.component';

describe('AddEditGradoEscolarComponent', () => {
  let component: AddEditGradoEscolarComponent;
  let fixture: ComponentFixture<AddEditGradoEscolarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditGradoEscolarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditGradoEscolarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
