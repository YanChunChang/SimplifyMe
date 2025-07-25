import { Component } from '@angular/core';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-simplification',
  standalone: true,
  imports: [ReactiveFormsModule, TextareaModule, ButtonModule, MessageModule, ToastModule, ButtonModule],
  templateUrl: './simplification.component.html',
  styleUrl: './simplification.component.scss',
  providers: [MessageService]
})
export class SimplificationComponent {
  form!: FormGroup;
  formSubmitted: boolean = false;
  summary: string = '';
  constructor(private messageService: MessageService, private ApiService: ApiService) {
    this.form = new FormGroup({
      text: new FormControl('', [Validators.required])
    });
  }

  onSubmit() {
    this.formSubmitted = true;
    if (this.form.valid) {
      this.ApiService.summarizeText(this.form.value.text).subscribe({
        next: (response) => {
          console.log('Text summarized successfully:', response);
          this.summary = response.summary;
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Text summarized successfully', life: 3000 });
          this.form.patchValue({ text: response.summary });
        },
        error: (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to summarize text', life: 3000 });
          console.error('Error summarizing text:', error);
        }
      });
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Please fill out the form correctly', life: 3000 });
    }
  }
 

  resetUpload() {
    this.form.reset();
    this.formSubmitted = false;
    this.summary = '';
}
}
