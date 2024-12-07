import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAulaComponent } from './list-aula.component';

describe('ListAulaComponent', () => {
  let component: ListAulaComponent;
  let fixture: ComponentFixture<ListAulaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListAulaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListAulaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
