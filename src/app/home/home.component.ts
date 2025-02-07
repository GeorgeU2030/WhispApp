import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule, 
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatSnackBarModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  joinGroupForm: FormGroup;

  constructor(
    private fb: FormBuilder
  ) {
    this.joinGroupForm = this.fb.group({
      user: ['', [Validators.required, Validators.minLength(3)]],
      chatGroup: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  joinGroup(): void {
    if (this.joinGroupForm.valid) {
      console.log('Joining group', this.joinGroupForm.value);
    }
  }
}