import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowExamenComponent } from './show-examen.component';

describe('ShowExamenComponent', () => {
  let component: ShowExamenComponent;
  let fixture: ComponentFixture<ShowExamenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowExamenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowExamenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
