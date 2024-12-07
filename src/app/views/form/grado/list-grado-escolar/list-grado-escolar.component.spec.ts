import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListGradoEscolarComponent } from './list-grado-escolar.component';

describe('ListGradoEscolarComponent', () => {
  let component: ListGradoEscolarComponent;
  let fixture: ComponentFixture<ListGradoEscolarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListGradoEscolarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListGradoEscolarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
