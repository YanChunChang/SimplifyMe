import { Component, model, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { FileUploadEvent, FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { GalleriaModule } from 'primeng/galleria';

@Component({
    selector: 'app-caption',
    standalone: true,
    imports: [CommonModule, FileUploadModule, ToastModule, ButtonModule, CardModule, GalleriaModule],
    templateUrl: './caption.component.html',
    styleUrl: './caption.component.scss',
    providers: [MessageService],
})
export class CaptionComponent {
    uploadedFiles: any[] = [];
    isUploading: boolean = false;
    images = model([]);

    responsiveOptions: any[] = [
        {
            breakpoint: '1300px',
            numVisible: 4
        },
        {
            breakpoint: '575px',
            numVisible: 1
        }
    ];

    constructor(private messageService: MessageService, private ApiService: ApiService) { }

    customUpload(event: any) {
        const files: File[] = event.files;

        this.uploadedFiles = files.map((file) => {
            const objectURL = URL.createObjectURL(file);
            return {
              itemImageSrc: objectURL,
              thumbnailImageSrc: objectURL,
              alt: file.name,
              title: file.name
            };
          });

        console.log("event.files", event.files);
        console.log("this.uploadedFiles", this.uploadedFiles);

        this.ApiService.getImageCaption(files).subscribe({
            next: (res) => {
              console.log('Caption Response:', res);
              this.messageService.add({ severity: 'success', summary: 'Upload erfolgreich' });
              this.isUploading = true;
            },
            error: (err) => {
              console.error('Fehler:', err);
              this.messageService.add({ severity: 'error', summary: 'Fehler beim Upload' });
            }
          });
        }

        resetUpload() {
            this.uploadedFiles = [];
            this.isUploading = false;
            // Optional: weitere Zustände zurücksetzen
          }
}
