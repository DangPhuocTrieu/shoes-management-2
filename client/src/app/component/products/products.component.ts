import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/services/product/product.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  // biến dùng để lưu tất cả sản phẩm
  products: Product[] = [] 

  // thêm một biến tạm ms dùng để lưu sản phẩm => hỗ trợ cho phần search, hiểu đơn giản ta không thể thay đổi (search) trên chính nó mà phải thông qua biến trung gian
  productsTemp: Product[] = []

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.getProducts() 
  }

  // hàm dùng để lấy tất cả sản phẩm từ server về và gán lại vào biến `products` để hiển thị
  getProducts(): void {
    this.productService.getProducts().subscribe(res => {
      this.products = res.data as Product[]
      this.productsTemp = this.products
    })
  }

  // khi thay đổi nội dung search, hàm này sẽ được gọi để lọc kết quả sản phần cần tìm
  handleSearchChange(e: any) {
    const searchValue = e.target.value
    this.products = this.productsTemp.filter(item => item.name.toLowerCase().includes(searchValue.toLowerCase()))
  }

}
