import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  imports: [RouterLink],
  templateUrl: './toast.html',
  styleUrl: './toast.css',
})
export class ToastContainer {
  protected readonly toastService = inject(ToastService);
}
