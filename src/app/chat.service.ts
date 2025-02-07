import { Injectable } from '@angular/core';
import { environment } from '../environments/environment.development';
import { BehaviorSubject } from 'rxjs';
import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  // observables
  public messages$ = new BehaviorSubject<any>([]);
  public activeUsers$ = new BehaviorSubject<any>([]);

  // variables
  public messages: any[] = [];
  public users: string[] = [];

  // connections
  public backend = environment.BACKEND_URL;
  public connection: signalR.HubConnection;

  constructor() {
    this.connection = this.createConnection();
    this.setupConnectionHandlers();
    this.start();
  }

  private createConnection(): signalR.HubConnection {
    return new signalR.HubConnectionBuilder()
      .withUrl(`${this.backend}/chat`)
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();
  }

  private setupConnectionHandlers(): void {
    this.connection.on("ReceiveMessage", (user: string, message: string, messageTime: string) => {
      this.messages = [...this.messages, { user, message, messageTime }];
      this.messages$.next(this.messages);
    });

    this.connection.on("ConnectedUser", (users: any) => {
      this.activeUsers$.next(users);
    });
  }

  public async start(): Promise<void> {
    try {
      if (this.connection.state === signalR.HubConnectionState.Disconnected) {
        await this.connection.start();
      }
    } catch (error) {
      console.error("Error during connection startup:", error);
      // Retry connection after a delay
      setTimeout(() => this.start(), 5000);
    }
  }

  

}
