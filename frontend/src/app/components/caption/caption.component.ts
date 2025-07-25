import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { FileUploadEvent, FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-caption',
  standalone: true,
  imports: [CommonModule, FileUploadModule, ToastModule, ButtonModule, CardModule],
  templateUrl: './caption.component.html',
  styleUrl: './caption.component.scss',
  providers: [MessageService]
})
export class CaptionComponent {
    uploadedFiles: any[] = [];

    constructor(private messageService: MessageService) {}

    onUpload(event:FileUploadEvent) {
        for(let file of event.files) {
            this.uploadedFiles.push(file);
        }

        this.messageService.add({severity: 'info', summary: 'File Uploaded', detail: ''});
    }

//   onFileSelected(event: any) {
//     this.uploadedFiles = event.target.files[0];
//   }

//   upload() {
//     if (!this.uploadedFiles) return;

//     this.ApiService.getImageCaption(this.uploadedFiles).subscribe(res => {
//       this.caption = res.caption;
//     });
//   }
}
