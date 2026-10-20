import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './layout/header/header';
import { ToastContainer } from './shared/toast/toast';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, ToastContainer],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
