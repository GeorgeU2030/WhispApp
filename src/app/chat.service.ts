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
  

  public async joinGroup(user: String, chatGroup: String): Promise<void> {
    try {
      // Check if connection is active
      if (this.connection.state === signalR.HubConnectionState.Disconnected) {
        await this.start();
      }
      return await this.connection.invoke("JoinGroup", { user, chatGroup });
    } catch (error) {
      console.error("Error joining group:", error);
      throw error;
    }
  }

  public async SendChatMessage(message: string) {
    try {
      if (this.connection.state === signalR.HubConnectionState.Disconnected) {
        await this.start();
      }
      return await this.connection.invoke("SendChatMessage", message);
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  }

  public async leaveChat() {
    try {
      // Clear local data
      this.messages = [];
      this.messages$.next([]);
      this.activeUsers$.next([]);
      
      // Stop the connection
      if (this.connection.state !== signalR.HubConnectionState.Disconnected) {
        await this.connection.stop();
        console.log("Connection stopped successfully");
      }
      
      // Create a new connection instance but don't start it yet
      this.connection = this.createConnection();
      this.setupConnectionHandlers();
    } catch (error) {
      console.error("Error stopping connection:", error);
      throw error;
    }
  }

}
