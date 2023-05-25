import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CART_KEY } from 'src/app/constants';
import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/services/product/product.service';
import { CartService } from 'src/app/services/cart/cart.service';

@Component({
  selector: 'app-detail-product',
  templateUrl: './detail-product.component.html',
  styleUrls: ['./detail-product.component.scss']
})
export class DetailProductComponent implements OnInit {
  product!: Product
  sizeList = [36, 37, 38, 39, 40, 41, 42]
  cartList: any[] = []
  sizeSelected = this.sizeList[0]
  quantity: number = 1


  constructor(
    public productService: ProductService, 
    private cartService: CartService, 
    private route: ActivatedRoute
    ) { }

  ngOnInit(): void {
    this.getProduct()
  }

  getProduct() {
    let id = this.route.snapshot.paramMap.get('id')           // lấy id của sản phẩm trên thanh url
    this.productService.getProduct(id).subscribe(res => {     // từ id đó mình gọi api để lấy thông tin sản phẩm
      this.product = res.data as Product
    })
  }

  // hàm thay đổi size đã chọn 
  handleChooseSize(size: number) {
    this.sizeSelected = size
  }

  hanldeAddToCart() {
    // list sản phẩm giỏ hàng mình lưu trong localStorage => cho nên giờ mình sẽ lấy từ localStorage ra
    this.cartList = this.cartService.getCartListStorage()

    let newCarts  // biến dùng để lưu giỏ hàng ms sau khi thêm

    // kiểm tra thử sản phẩm chuẩn bị thêm vào giỏ hàng đã có trong giỏ hàng chưa (dựa vào id và size)
    const product = this.cartList.find(item => item._id === this.product._id && item.size === this.sizeSelected)

    if (product) {        // TH1: nếu có tồn tại thì tức là mình sẽ ko thêm mới sản phẩm ms trong giỏ hàng, mà mình sẽ + số lượng của sản phẩm đó lên
      newCarts = this.cartList.map(item => {
        if (item._id === product._id && item.size === this.sizeSelected) {
          item.quantity += this.quantity
        }
        return item
      })
    } else {              // TH2: ngược lại, nếu không tồn tại thì mình sẽ thêm mới vào list giỏ hàng
      let newProduct = {
        ...this.product, 
        size: this.sizeSelected,  // khi thêm mới mình cần thêm 2 key là size và quantity, do 2 key này là do người dùng nhập dữ liệu
        quantity: this.quantity
      }
      newCarts = [ ...this.cartList, newProduct ]     // cú pháp ... : thêm `newProduct` vào mảng `cartList` và gán lại cho `newCarts`
    }
    
    localStorage.setItem(CART_KEY, JSON.stringify(newCarts))    // lưu list giỏ hàng mới vào localStorage
    this.cartService.handleChangeCartQuantity()

    this.sizeSelected = this.sizeList[0]   // reset lại size 
    this.quantity = 1                     // reset lại số lượng 

    this.productService.displayMessage('Added to cart', 'Successfully')
  }
}