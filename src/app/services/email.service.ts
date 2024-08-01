import { Injectable } from '@angular/core';
import emailjs from 'emailjs-com';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private serviceId = 'service_6lnt9pe';
  private templateId = 'template_l78phmh';
  private userId = 'GLzu5kz-LdBrqkrJ_';

  constructor() {}

  sendEmail(to: string,name:string): Promise<void> {
    const templateParams = {
      to_email: to,
      name
    };

    return emailjs.send(this.serviceId, this.templateId, templateParams, this.userId)
      .then((response) => {
        console.log('Email sent successfully:', response);
      })
      .catch((error) => {
        console.error('Error sending email:', error);
      });
  }
  private userData: any;

  setUserData(data: any) {
    this.userData = data;
  }

  getUserData() {
    return this.userData;
  }
}
