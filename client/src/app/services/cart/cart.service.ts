import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CART_KEY } from 'src/app/constants';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartQuantity$ = new Subject<number>()

  // hàm này dùng để tính tổng số lượng của tất cả các sản phẩm có trỏng giỏ hàng
  getCartQuantity(): number {
    const cartList = this.getCartListStorage()                                           // đầu tiên, lấy danh sách giỏ hàng từ localStorage
    const quantity = cartList?.reduce((total, item) => total += item.quantity, 0)       // sau đó + tất cả số lượng sản phầm lại thông qua phương thức `reduce`
    return quantity   // và return về tổng số lượng
  }
  
  // khi có sự thay đổi nào đó về số lượng sản phẩm trong giỏ hàng, ta sẽ gọi hàm này.
  handleChangeCartQuantity(): void {
    const quantity = this.getCartQuantity()  // lấy tổng số lượng
    this.cartQuantity$.next(quantity)        // sau đó ta sẽ next nó đi => để những chỗ khác biết được sự thay đổi của nó(tổng số lương) và cập nhật theo
  }
  /* 
    ví dụ ta có 10 sản phẩm, khi ta xóa 1 sản phẩm trong giỏ hàng => gọi hàm này => next đi dữ liệu ms (sau khi xóa là còn 9 sản phẩm)
    => những chố khác nhận đc số lượng là 9 (thông qua subsricbe()) và update lại trên giao diện
   */


  // lấy danh sách sản phẩm giỏ hàng từ localStorage
  getCartListStorage(): any[] {
    const cartsJSON: any = localStorage.getItem(CART_KEY)
    return cartsJSON !==  null ? JSON.parse(cartsJSON) : []
  }
}
