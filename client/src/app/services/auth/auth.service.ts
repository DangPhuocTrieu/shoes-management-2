import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { USER_KEY } from '../../constants';
import { User } from '../../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private BASE_URL = 'http://localhost:8000/api/auth'

  constructor(private http: HttpClient) { }

  // hàm đăng kí user: data nhận vào là username và password của user đăng kí
  signUp(data: any): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}/signup`, data)
  }

  // hàm đăng nhập user: data nhận vào là username và password của user
  login(data: any): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}/login`, data)
  }

  /* 
    Hàm này dùng để lấy thông tin của user đã đăng nhập từ localStorage (hiểu đơn giản localStorage dùng để lưu thông tin nào đó trên máy local của mình)
    Thì tại sao mình cần làm vậy ? Bởi vì: Khi đăng nhập thành công, mình cần lưu lại thông tin của user đã đăng nhập
    => khi F5 lại trang, mình có thể lấy thông tin của user đó từ localStorage => không bị mất dữ liệu
  */
  getUserStorage(): User {
    const userJSON: any = localStorage.getItem(USER_KEY)
    return JSON.parse(userJSON)
  }
}

