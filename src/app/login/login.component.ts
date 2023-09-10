import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  @ViewChild('loginContent', { static: true }) loginSectionRef!: ElementRef<HTMLElement>;

  constructor(private renderer: Renderer2) { }

  ngAfterViewInit() {
    this.removeSingleAnimationClass()
  }

  removeSingleAnimationClass() {
    const loginSection = this.loginSectionRef.nativeElement;
    setTimeout(() => {
      this.renderer.removeClass(loginSection, 'animate-once');
    }, 2000);
  }
}
