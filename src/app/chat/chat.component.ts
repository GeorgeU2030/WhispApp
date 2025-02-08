import { ChangeDetectorRef, Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
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

  userDisplayName = sessionStorage.getItem("user");
  groupName = sessionStorage.getItem("chatGroup");

  // start
  ngOnInit() {
    console.log('chat component init');
  }

  // destroy
  ngOnDestroy() {
    console.log('chat component destroy');
  }


  SendChatMessage(){
    console.log('sendChatMessage');
  }

  leaveChat(){
    console.log('leaveChat');
  }

  // automatic scroll
  scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop = 
        this.scrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }
}
