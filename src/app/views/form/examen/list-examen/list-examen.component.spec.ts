import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListExamenComponent } from './list-examen.component';

describe('ListExamenComponent', () => {
  let component: ListExamenComponent;
  let fixture: ComponentFixture<ListExamenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListExamenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListExamenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
