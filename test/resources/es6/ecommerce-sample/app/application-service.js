import { SalesService } from "../sales/sales-service";
import { OrderRequest } from "../sales/order-request";

export class ApplicationService {
    constructor() {
        this.salesService = new SalesService();
    }
    placeOrder(orderRequest) {
        this.salesService.placeOrder(orderRequest);
    }
}
