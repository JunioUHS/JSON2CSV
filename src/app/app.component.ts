import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TableCsvComponent } from "./table-csv/table-csv.component";
import { Csv } from "./models/Csv";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule, CommonModule, TableCsvComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'JSON2CSV';

  form!: FormGroup;
  jsonTextArea: string = '';
  csvTextArea: string = '';
  csvObj: Csv = { headers: [], body: [] };

  get formControls(): any {
    return this.form.controls;
  }

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      json: ['', Validators.required],
      csv: [{value: '', disabled: true}]
    });
  }

  convertJsonToCSV() {
    try {

      if (!this.validateForm()) return;

      const arrayStringCsv: string[] = [];
      const arrayObjJson = JSON.parse(this.jsonTextArea);
      let headers: string[] = [];

      arrayObjJson.forEach((rowJson: any) => {
        const keys = Object.keys(rowJson);

        headers = [...new Set([...headers, ...keys])];
      });

      arrayStringCsv.push(headers.join(','));
      this.csvObj.headers = headers;
      this.csvObj.body = arrayObjJson;

      arrayObjJson.forEach((row: any) => {
        const rowCsv = headers.map(header => {
          const aux: string = isNaN(row[header]) ? ( row[header] ? `"${row[header]}"` : '' ) : row[header];
          return aux;
        });

        arrayStringCsv.push(rowCsv.join(','));
      });

      const csv = arrayStringCsv.join('\n');
      this.csvTextArea = csv;

    } catch(error) {
      this.csvTextArea = 'Ocorreu um erro na conversão. Verifique o JSON e tente novamente.';
    }

  }

  private validateForm(): boolean {
    this.form.markAllAsTouched();

    try {
      let primitiveTypeError = false;
      const arrayJson = JSON.parse(this.jsonTextArea);

      if (!Array.isArray(arrayJson) || Array.isArray(arrayJson[0]) || arrayJson.length === 0) {
        this.formControls.json.setErrors({ multidimensionalArray: true });
        this.cleanFields();
        return false;
      }

      if(typeof arrayJson !== 'object' || arrayJson === null) {
        this.formControls.json.setErrors({ jsonInvalido: true });
        this.cleanFields();
        return false;
      }

      arrayJson.forEach((row: any) => {
        const values = Object.values(row);
        values.forEach((value: any) => {
          if(typeof value !== 'string' && typeof value !== 'number' && typeof value !== 'boolean') {
            primitiveTypeError = true;
          }
        })
      });

      if(primitiveTypeError) {
        this.formControls.json.setErrors({ primitiveTypeError: true });
        this.cleanFields();
        return false;
      }

    } catch(error) {
      this.formControls.json.setErrors({ jsonInvalido: true });
      this.cleanFields();
      return false;
    }

    return true;
  }

  public cssValidator(fieldForm: FormControl): boolean {
    return !!fieldForm.errors && fieldForm.touched;
  }

  private cleanFields(): void {
    this.csvObj = { headers: [], body: [] };
    this.csvTextArea = '';
  }

  public resetForm(): void {
    this.cleanFields();
    this.form.reset();
  }
}
