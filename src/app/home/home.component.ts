import { Component, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ChatService } from '../chat.service';

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
export class HomeComponent implements OnInit {

  joinGroupForm!: FormGroup;

  formBuilder = inject(FormBuilder);

  router = inject(Router);
  chatService = inject(ChatService)

  ngOnInit(): void {
    // Initialize the form and define its structure with validation rules
    this.joinGroupForm = this.formBuilder.group({
      user: ['', Validators.required],         // User input with required validation
      chatGroup: ['', Validators.required]      // Chat group input with required validation
    });

  }

  joinGroup(): void {
    if (this.joinGroupForm.valid) {
      // Extract user and chatGroup values from the form
      const { user, chatGroup } = this.joinGroupForm.value;
    
      // Store user and chatGroup values in sessionStorage for future use
      sessionStorage.setItem("user", user);
      sessionStorage.setItem("chatGroup", chatGroup);
    
      // Call the joinGroup method from the chat service
      this.chatService.joinGroup(user, chatGroup)
        .then(() => {
          // If the joinGroup operation is successful, navigate to the 'chat' route
          this.router.navigate(['chat']);
        })
        .catch((error) => {
          // If there's an error during the joinGroup operation, log the error
          console.log(error);
        });
    }
  }
}