import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-mahasiswa',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './mahasiswa.component.html',
  styleUrls: ['./mahasiswa.component.css']
})
export class MahasiswaComponent implements OnInit {
  mahasiswaList: any[] = [];
  prodiList: any[] = [];
  apiMahasiswaUrl = 'https://crud-express-seven.vercel.app/api/mahasiswa';
  apiProdiUrl = 'https://crud-express-seven.vercel.app/api/prodi';
  isLoading = true;
  mahasiswaForm: FormGroup;
  isSubmitting = false;

  private http = inject(HttpClient);
  private fb = inject(FormBuilder);

  constructor() {
    this.mahasiswaForm = this.fb.group({
      npm: [''],
      nama: [''],
      prodi_id: [null],
      jenis_kelamin: ['L'],
      asal_sekolah: ['']
    });
  }

  ngOnInit(): void {
    this.getMahasiswa();
    this.getProdi();
  }

  // Fetch Mahasiswa Data
  getMahasiswa(): void {
    this.http.get<any[]>(this.apiMahasiswaUrl).subscribe({
      next: (data) => {
        this.mahasiswaList = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching mahasiswa data:', err);
        this.isLoading = false;
      },
    });
  }

  // Fetch Prodi Data
  getProdi(): void {
    this.http.get<any[]>(this.apiProdiUrl).subscribe({
      next: (data) => {
        this.prodiList = data;
      },
      error: (err) => {
        console.error('Error fetching prodi data:', err);
      },
    });
  }

  // Add Mahasiswa
  addMahasiswa(): void {
    if (this.mahasiswaForm.valid) {
      this.isSubmitting = true;
      this.http.post(this.apiMahasiswaUrl, this.mahasiswaForm.value).subscribe({
        next: (response) => {
          console.log('Mahasiswa berhasil ditambahkan:', response);
          this.getMahasiswa();
          this.mahasiswaForm.reset({ jenis_kelamin: 'L' });
          this.isSubmitting = false;

          const modalElement = document.getElementById('tambahMahasiswaModal') as HTMLElement;
          if (modalElement) {
            const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
            modalInstance.hide();
          }
        },
        error: (err) => {
          console.error('Error menambahkan mahasiswa:', err);
          this.isSubmitting = false;
        },
      });
    }
  }
}
