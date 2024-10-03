import { Component, Input } from '@angular/core';
import { Csv } from '../models/Csv';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-table-csv',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table-csv.component.html',
  styleUrl: './table-csv.component.css'
})
export class TableCsvComponent {
  @Input() csv!: Csv;

  constructor() { }
}
