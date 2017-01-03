import {SalesService} from "../sales/sales-service";
import {OrderRequest} from "../sales/order-request";
import {CustomerRepository} from "../shared/customer-repository";
import {Product} from "../shared/product";


export class ApplicationService {
    private customerRepository = new CustomerRepository();
    private salesService = new SalesService();

    public placeOrder(): void {
        let customer = this.customerRepository.get("42");
        let orderRequest = new OrderRequest(customer);
        orderRequest.addProduct(new Product("blue", "xl", 123));
        this.salesService.placeOrder(orderRequest);
    }
}
