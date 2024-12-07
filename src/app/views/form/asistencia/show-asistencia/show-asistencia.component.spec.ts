import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAsistenciaComponent } from './show-asistencia.component';

describe('ShowAsistenciaComponent', () => {
  let component: ShowAsistenciaComponent;
  let fixture: ComponentFixture<ShowAsistenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowAsistenciaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowAsistenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
