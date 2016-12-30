import {SalesService} from "../sales/sales-service";
import {OrderRequest} from "../sales/order-request";


export class ApplicationService {
    private salesService: SalesService = new SalesService();

    public placeOrder(orderRequest: OrderRequest): void {
        this.salesService.placeOrder(orderRequest);
    }
}
