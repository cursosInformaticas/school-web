import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowCalificaionComponent } from './show-calificacion.component';

describe('ShowCalificaionComponent', () => {
  let component: ShowCalificaionComponent;
  let fixture: ComponentFixture<ShowCalificaionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowCalificaionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowCalificaionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
