import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:8000/api';
  constructor(private http: HttpClient) {}


  analyzeSentiment(text: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/sentiment`, { text });
  }

  summarizeText(text: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/explain`, { text });
  }

  getImageCaption(files: File[]): Observable<{ filename: string; caption: string }[]> {
    const formData = new FormData();
    for (const file of files) {
      formData.append('files', file, file.name);  //"files" muss zum Backend passen
    }
    return this.http.post<{ filename: string; caption: string }[]>(`${this.baseUrl}/caption`, formData);
  }
}
