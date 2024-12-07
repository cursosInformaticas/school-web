import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCalificaionComponent } from './list-calificacion.component';

describe('ListCalificaionComponent', () => {
  let component: ListCalificaionComponent;
  let fixture: ComponentFixture<ListCalificaionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListCalificaionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListCalificaionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
