import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  /*
    khi người dùng muốn vào trang admin bằng url là \admin => hàm này sẽ được gọi và kiểm tra trước khi cho ng dùng truy cập vào
    => bằng cách lấy user đã đăng nhập từ localStorage và kiểm tra có quyền admin không thông qua biến `isAdmin`
    => nếu isAdmin = true thì cho phép truy cập và ngược lại
  */
  canActivate(): boolean {
    return this.authService.getUserStorage()?.isAdmin === true
  }
}
