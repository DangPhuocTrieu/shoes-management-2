import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import { Product } from '../../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private BASE_URL = 'http://localhost:8000/api/product'

  constructor(private http: HttpClient, private messageService: MessageService) { }

  // hàm dùng để lấy tất cả các sản phẩm trên server (lấy dữ liệu => phương thức get)
  getProducts(): Observable<any> {
    return this.http.get<any>(this.BASE_URL)
  }

  // hàm dùng để lấy một sản phẩm nào đó dựa vào id (lấy dữ liệu => phương thức get)
  getProduct(id: string | null): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}/${id}`)
  }

  // hàm này nhận vào tham số là price(số tiền) => dùng để format số hiện tại thành VND(ví dụ: 5.000VND) => hàm này đc lấy từ trên gg
  formatVND(price: number): string {
    return price.toLocaleString('vi', {style : 'currency', currency : 'VND'});
  }

  displayMessage(detail: string,summary?: string, severity: string = 'success'): void {
    this.messageService.add({ severity, summary, detail })
  }

  // ADMIN ROLE

  // hàm này nhận vào tham số là sản phẩm cần thêm => dùng để thêm vào một sản phẩm mới (thêm dữ liệu => phương thức post)
  addProduct(data: Product): Observable<any> {
    return this.http.post<any>(this.BASE_URL, data)
  }

  // hàm này nhận vào tham số là sản phẩm cần sửa => dùng để sửa vào một sản phẩm (sửa dữ liệu => phương thức put)
  editProduct(product: Product): Observable<any> {
    return this.http.put<any>(`${this.BASE_URL}/${product._id}`, product)
  }

   // hàm này nhận vào tham số là id của sản phẩm cần xóa => dùng để xóa vào một sản phẩm (xóa dữ liệu => phương thức delete)
  deleteProduct(id: string): Observable<any> {
    return this.http.delete<any>(`${this.BASE_URL}/${id}`)
  }

  /* 
    hàm này nhận vào tham số là 1 File: nó là file sau khi ta tải 1 hình ảnh từ máy lên
    Và ta cần lấy được link của hình ảnh đó để lưu vào database
    => ta sẽ gọi api để lưu lên ứng ụng cloundiary => sau khi lưu api sẽ trả về link của hình ảnh đó
  */
  uploadImage(file: File): Observable<any> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', 'instagramimages')     // instagramimages: tên thư mục chứa ảnh 
    return this.http.post<any>('https://api.cloudinary.com/v1_1/ddwurilrw/image/upload', formData)   // gọi api để lưu lên cloundiary
  }
}
