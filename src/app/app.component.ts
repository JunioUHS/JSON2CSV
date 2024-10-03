import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'JSON2CSV';

  form!: FormGroup;
  jsonTextArea: string = '';
  csvTextArea: string = '';

  get f(): any {
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

      const arrayCsv: string[] = [];
      const arrayJson = JSON.parse(this.jsonTextArea);
      const headers = Object.keys(arrayJson[0]);

      arrayCsv.push(headers.join(','));

      arrayJson.forEach((row: any) => {
        const rowCsv = headers.map(header => {
          const aux = isNaN(row[header]) ? `"${row[header]}"` : row[header];
          return aux;
        });

        arrayCsv.push(rowCsv.join(','))
        console.log(rowCsv);
        console.log(arrayCsv);
      });

      const csv = arrayCsv.join('\n');
      this.csvTextArea = csv;

    } catch(error) {
      this.csvTextArea = 'Ocorreu um erro na conversão. Verifique o JSON e tente novamente.';
    }

  }

  private validateForm(): boolean {
    this.form.markAllAsTouched();

    try {
      const arrayJson = JSON.parse(this.jsonTextArea);

      if(typeof arrayJson === 'object' && arrayJson !== null) {
        return true;

      } else {
        this.f.json.setErrors({ jsonInvalido: true });
        return false;
      }

    } catch(error) {
      this.f.json.setErrors({ jsonInvalido: true });
      return false;
    }
  }

  public cssValidator(fieldForm: FormControl): boolean {
    return !!fieldForm.errors && fieldForm.touched;
  }

  public resetForm(): void {
    this.form.reset();
  }
}
