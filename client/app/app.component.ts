import { Component } from '@angular/core';
import { Http } from "@angular/http";
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';

class User {
  firstname: string;
  lastname: string;
  password: string;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent {
  title = 'app';
  socket:any   /*SocketIOClient.Socket - cannot find namespace*/
  user: User = new User();
  constructor(private http:Http){}
  ngOnInit(){
    this.socket = io.connect('http://localhost:3000/online');
    console.log(this.socket);
    this.socket.on('msg', (msg)=>{
      this.socket.emit('message', {message: `hi to ${this.socket.nsp} namespace`})
    })
  }

  save(){
    this.http.post('http://localhost:3000/api/v1.0/user/login', this.user)
    .toPromise()
    .then((user)=>{
      user = user.json();
      this.socket.emit('online', user['_id'])
    })
  }
}
