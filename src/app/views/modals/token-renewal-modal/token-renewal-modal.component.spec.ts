import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TokenRenewalModalComponent } from './token-renewal-modal.component';

describe('TokenRenewalModalComponent', () => {
  let component: TokenRenewalModalComponent;
  let fixture: ComponentFixture<TokenRenewalModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TokenRenewalModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TokenRenewalModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
