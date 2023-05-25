import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth/auth.service';
import { USER_KEY } from '../../constants/index';
import { CartService } from 'src/app/services/cart/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  cartQuantity!: number
  user!: User | null

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
     // lấy thông tin của user đã đăng nhập từ localStorage => hàm này chạy mỗi khi F5 => khi F5 thông tin user không bị mất
    this.user = this.authService.getUserStorage()

    this.getCartQuantity()
  }

  getCartQuantity(): void {
    // khi số lượng có sự thay đổi ở nơi nào đó => ta subscribe vao => có được số lượng ms nhất => hiển thị lại giao diện
    this.cartService.cartQuantity$.subscribe(value => {
      this.cartQuantity = value
    })

    // trường hợp F5 lại trang, ta lấy tổng số lượng từ localStorage để hiển thị
    this.cartQuantity = this.cartService.getCartQuantity()
  }

  // hàm xử lí khi đăng xuất user
  handleLogout(): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to log out?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        localStorage.removeItem(USER_KEY)       // xóa thông tin user ra khỏi localStorage
        this.user = null                        // xóa user
        this.router.navigateByUrl('/')          // chuyển hướng về trang chủ

        this.messageService.add({severity:'success', summary:'Confirmed', detail:'Log out successfully'})
      },
      reject: () => {
        this.confirmationService.close()
      }
    })
  }
}
