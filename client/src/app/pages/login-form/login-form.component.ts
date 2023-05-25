import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { USER_KEY } from 'src/app/constants';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent {

  form: FormGroup = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  })
  constructor(
    private fb: FormBuilder, 
    private authService: AuthService, 
    private messageService: MessageService,
    private router: Router
    ) {}

  handleSubmit(form: FormGroup) {
    form.markAllAsTouched()    // markAllAsTouched: hiện tất cả các error có trong formGroup ra UI

    if (!form.valid) return

    // gọi api login
    this.authService.login(this.form.value).subscribe({
      next: (res: any) => {                   // khi thành công => chạy vào function next()
        const user = res.data
        localStorage.setItem(USER_KEY, JSON.stringify(user)) // lưu thông tin user vào localStorage

        if (user.isAdmin) {
          this.router.navigate(['/admin'])   // nếu là admin thì chuyển hướng tới trang admin
        } else {
          this.router.navigate(['/'])        // không phải admin thì chuyển hướng tới trang chủ
        }
      },
      error: ({ error }) => {               // khi có lỗi => chạy vào function error()
        this.messageService.add({severity:'error', summary:'Failed', detail: error.message });
      }
    })
  }

}
