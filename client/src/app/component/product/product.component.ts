import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/services/product/product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent {
  @Input() product!: Product

  constructor(public productService: ProductService, private router: Router) { }

  // khi bấm vào một sản phẩm nào đó => chuyển trang đến trang chi tiết sản phẩm thông qua id
  handleNavigate(id: string) {
    this.router.navigate(['product', id])
  }
}
