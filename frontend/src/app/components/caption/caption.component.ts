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
    selectedImageIndex: number = 0;
    selectedCaption: string = '';

    responsiveOptions: any[] = [
        {
            breakpoint: '1300px',
            numVisible: 4
        },
        {
            breakpoint: '575px',
            numVisible: 2
        }
    ];
    captionMap: any;

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

        this.ApiService.getImageCaption(files).subscribe({
            next: (res) => {
                this.uploadedFiles = res.map((r: any) => ({
                    itemImageSrc: URL.createObjectURL(files.find(f => f.name === r.filename)!),
                    thumbnailImageSrc: URL.createObjectURL(files.find(f => f.name === r.filename)!),
                    filename: r.filename
                  }));
            
                  // speichern der Captions
                  this.captionMap = res.reduce((acc: any, curr: any) => {
                    acc[curr.filename] = curr.caption;
                    return acc;
                  }, {});
            
                  // erstes Bild setzen
                  this.selectedImageIndex = 0;
                  const firstFilename = this.uploadedFiles[0]?.filename;
                  this.selectedCaption = this.captionMap[firstFilename] || '';
                  this.messageService.add({ severity: 'success', summary: 'Upload successful' });
                  this.isUploading = true;
            },
            error: (err) => {
                console.error('Fehler:', err);
                this.messageService.add({ severity: 'error', summary: 'Error during upload' });
            }
        });
    }

    onImageChange(event: any) {
        this.selectedImageIndex = event;
        const currentFile = this.uploadedFiles[this.selectedImageIndex];
        this.selectedCaption = this.captionMap[currentFile.filename] || '';
    }

    resetUpload() {
        this.uploadedFiles = [];
        this.isUploading = false;
    }
}
