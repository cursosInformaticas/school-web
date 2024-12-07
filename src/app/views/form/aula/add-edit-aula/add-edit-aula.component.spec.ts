import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditAulaComponent } from './add-edit-aula.component';

describe('AddEditAulaComponent', () => {
  let component: AddEditAulaComponent;
  let fixture: ComponentFixture<AddEditAulaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditAulaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditAulaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
