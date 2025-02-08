import { ChangeDetectorRef, Component, ElementRef, HostListener, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MediaMatcher } from '@angular/cdk/layout';
import { ChatService } from '../chat.service';

@Component({
  selector: 'app-chat',
  imports: [MatSidenavModule, MatToolbarModule, MatIconModule, MatButtonModule, MatInputModule, MatListModule, MatCardModule, MatFormFieldModule, CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit, OnDestroy {

  // destructuring
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  constructor(private router: Router,  private changeDetectorRef: ChangeDetectorRef,
    private media: MediaMatcher) { 
      this.mobileQuery = media.matchMedia('(max-width: 600px)');
      this._mobileQueryListener = () => changeDetectorRef.detectChanges();
      this.mobileQuery.addListener(this._mobileQueryListener);
  }

  // service
  chatService = inject(ChatService);

  // values
  inputMessage: string = '';
  messages: any[] = [];

  userDisplayName = sessionStorage.getItem("user");
  groupName = sessionStorage.getItem("chatGroup");

  // start
  ngOnInit() {
    this.chatService.messages$.subscribe((res) => {
      // Update the local messages array and log to console
      this.messages = res;
      console.log(this.messages);
    });

    // Subscribe to connected users updates from the chat service
    this.chatService.activeUsers$.subscribe((res) => {
      // Log connected users to console
      console.log(res);
    });

    if (sessionStorage.getItem('shouldRedirect') === 'true' || !this.userDisplayName || !this.groupName) {
      sessionStorage.removeItem('shouldRedirect');
      this.router.navigate(['home']);
    }
  }

  // destroy
  ngOnDestroy() {
    console.log('chat component destroy');
  }


  SendChatMessage(){
    // Call the SendChatMessage method from the chat service with the inputMessage
    this.chatService.SendChatMessage(this.inputMessage)
      .then(() => {
        // If the message is sent successfully, reset the inputMessage variable
        this.inputMessage = '';
      })
      .catch((err) => {
        // Log any errors that occur during the SendChatMessage operation
        console.log(err);
      });
  }

  async leaveChat(){
    try {
      await this.chatService.leaveChat();
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("chatGroup");
      await this.router.navigate(['home']);
    } catch (error) {
        console.error("Error leaving chat:", error);
    }
  }

  // automatic scroll
  scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop = 
        this.scrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }

  @HostListener('window:beforeunload', ['$event'])
beforeUnloadHandler(event: BeforeUnloadEvent) {
      // Mostrar confirmación antes de cerrar o recargar
      event.preventDefault();
      event.returnValue = 'Are you sure you want to leave?'; 
  }

  @HostListener('window:unload')
  unloadHandler() {
      this.chatService.leaveChat(); // Realizar limpieza cuando la página se cierre
      // Marcar que se necesita redirigir
      sessionStorage.setItem('shouldRedirect', 'true');
  }
}
