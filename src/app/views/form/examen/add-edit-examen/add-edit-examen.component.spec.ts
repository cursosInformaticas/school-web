import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditExamenComponent } from './add-edit-examen.component';

describe('AddEditExamenComponent', () => {
  let component: AddEditExamenComponent;
  let fixture: ComponentFixture<AddEditExamenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditExamenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditExamenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
