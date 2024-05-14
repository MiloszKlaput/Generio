import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetIssueFormComponent } from './get-issue-form.component';

describe('GetIssueFormComponent', () => {
  let component: GetIssueFormComponent;
  let fixture: ComponentFixture<GetIssueFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetIssueFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GetIssueFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
