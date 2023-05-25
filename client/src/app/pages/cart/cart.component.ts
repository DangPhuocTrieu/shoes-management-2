import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { CART_KEY } from 'src/app/constants';
import { CartService } from 'src/app/services/cart/cart.service';
import { ProductService } from 'src/app/services/product/product.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartList: any[] = []
  cartListTemp: any[] = []
  columns: any[] = [
    { field: 'name', header: 'Name' },
    { field: 'price', header: 'Price' },
    { field: 'quantity', header: 'quantity' },
    { field: 'size', header: 'Size' },
    { field: 'total', header: 'Total' }
  ]
  searchValue = ''

  constructor(
    private productService: ProductService, 
    private cartService: CartService, 
    public confirmationService: ConfirmationService,
    ) { }

  ngOnInit(): void {
    this.cartList = this.cartService.getCartListStorage()
    this.cartListTemp = this.cartList
  }

  formatPrice(price: number): string {
    return this.productService.formatVND(price)
  }


  // tính tổng tiền của 1 sản phẩm (số lượng x giá tiền)
  handleTotalPrice(): string {
    return this.formatPrice(this.cartList?.reduce((total, cur) => total += cur.price * cur.quantity , 0))
  }

  handleChangequantity(product: any, newquantity: number): void {
    // nếu số lượng thay đổi < 1 thì return về
    if (newquantity < 1) {
      return
    }
  
    // duyệt qua mảng và cập nhất lại số lượng của sản phẩm mà mình vừa thay đổi
    this.cartList = this.cartList.map(item => {
      if (item._id === product._id && item.size === product.size) {
        item.quantity = newquantity
      }
      return item
    })

    localStorage.setItem(CART_KEY, JSON.stringify(this.cartList)) // lưu lại danh sách mới vào localStorage
    this.cartService.handleChangeCartQuantity()   // sau khi thay đổi, ta gọi hàm này (này ns rồi, click vào hàm để xem chi tiết hơn)
  }
  

  // hàm xóa 1 sản phẩm (ta dựa vào id và size để xóa)
  handleDelete(id: string, size: number): void { 
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete product?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {   
        this.cartList = this.cartList.filter(item => (item._id === id && item.size !== size) || item._id !== id)  // lọc ra sản phẩm đã xóa
        this.cartListTemp = this.cartList

        localStorage.setItem(CART_KEY, JSON.stringify(this.cartList)) // lưu lại danh sách mới vào localStorage
        this.cartService.handleChangeCartQuantity()                   // sau khi xóa, ta gọi hàm này (này ns rồi, click vào hàm để xem chi tiết hơn)

        this.productService.displayMessage('Deleted product', 'Successfully')     
      }
    })
  }

  // thanh toán giỏ hàng
  handlePayment(): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to pay for all products?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {   
        localStorage.removeItem(CART_KEY)  // thanh toán xong, ta phải remove giỏ hàng khỏi localStorage
        this.cartList = []                // xóa tất cả sản phẩm
        this.cartListTemp = []

        this.productService.displayMessage('Successful payment', 'Successfully')
      }
    })
  }

  // khi thay đổi nội dung search, hàm này sẽ được gọi để lọc kết quả sản phần cần tìm
  handleSearchChange(e: any): void {
    const searchValue = e.target.value
    this.cartList = this.cartListTemp.filter(item => item.name.toLowerCase().includes(searchValue.toLowerCase()))
  }
}
