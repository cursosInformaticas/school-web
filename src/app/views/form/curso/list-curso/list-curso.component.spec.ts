import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCursoComponent } from './list-curso.component';

describe('ListCursoComponent', () => {
  let component: ListCursoComponent;
  let fixture: ComponentFixture<ListCursoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListCursoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListCursoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
