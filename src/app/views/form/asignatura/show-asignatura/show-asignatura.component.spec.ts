import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAsignaturaComponent } from './show-asignatura.component';

describe('ShowAsignaturaComponent', () => {
  let component: ShowAsignaturaComponent;
  let fixture: ComponentFixture<ShowAsignaturaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowAsignaturaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowAsignaturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
