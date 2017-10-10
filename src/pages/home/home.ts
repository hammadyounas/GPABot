import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Http, Headers } from "@angular/http";
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Content } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  msg;
  imgurl;
  itemList = document.getElementById("item-list");
  //char;
  arr = [];
  convo: FirebaseListObservable<any>;
  @ViewChild(Content) content: Content;

  constructor(public navCtrl: NavController, private http: Http, private db: AngularFireDatabase) {
    this.convo = this.db.list('/conversation', {
      preserveSnapshot: true,
      query: {
        limitToLast: 30
      }
    });
    this.convo.subscribe(snapshots => {
      this.arr = [];
      snapshots.forEach(element => {
        this.arr.push(element.val());
      });

      //for scroll down
      setTimeout(() => {
        this.content.scrollToBottom();
      }, 0);
    })
  };
  ngOnChanges() {
    console.log('cheannndheh');

    //this.itemList.scrollTop = this.itemList.scrollHeight

  }
  sendMessage() {
    console.log(this.msg);
    let send = { name: 'you', imgurl: '../assets/images/user.png', msg: this.msg }
    this.db.list('/conversation').push(send);
    this.sendBot();
    this.msg = '';
  }
  sendBot() {
    let bot = { name: 'bot', imgurl: '../assets/images/bot.png', msg: '' }
    let headers = new Headers()
    headers.append(
      'Authorization', 'Bearer 0dc83fb388664bb693a62d1fc4e9dc0a'
    )
    this.http.get('https://api.api.ai/v1/query?v=20150910&query=' + this.msg + '&lang=en&sessionId=2eff3468-6073-4351-b6a2-07f2605d5f4f&timezone=Asia/Karachi', { headers: headers })
      .subscribe((response) => {
        bot.msg = response.json().result.fulfillment.speech;
        this.db.list('/conversation').push(bot);
      })
  }
  check(event) {
    console.log("event.code", event.code);
    if (event.code === "Enter") {
      event.preventDefault();
      this.sendMessage();
    }
  }

}
