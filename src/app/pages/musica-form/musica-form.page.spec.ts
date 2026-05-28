import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MusicaFormPage } from './musica-form.page';

describe('MusicaFormPage', () => {
  let component: MusicaFormPage;
  let fixture: ComponentFixture<MusicaFormPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MusicaFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
