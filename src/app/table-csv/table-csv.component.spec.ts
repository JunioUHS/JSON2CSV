import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableCsvComponent } from './table-csv.component';

describe('TableCsvComponent', () => {
  let component: TableCsvComponent;
  let fixture: ComponentFixture<TableCsvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableCsvComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableCsvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
