import { SalesService } from "../sales/sales-service";
import { OrderRequest } from "../sales/order-request";
import { CustomerRepository } from "../shared/customer-repository";
import { Product } from "../shared/product";
export class ApplicationService {
    constructor() {
        this.customerRepository = new CustomerRepository();
        this.salesService = new SalesService();
    }
    placeOrder() {
        let customer = this.customerRepository.get("42");
        let orderRequest = new OrderRequest(customer);
        orderRequest.addProduct(new Product("blue", "xl", 123));
        this.salesService.placeOrder(orderRequest);
    }
}
