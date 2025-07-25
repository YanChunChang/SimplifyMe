import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimplificationComponent } from './simplification.component';

describe('SimplificationComponent', () => {
  let component: SimplificationComponent;
  let fixture: ComponentFixture<SimplificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimplificationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimplificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
