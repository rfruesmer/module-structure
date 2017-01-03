import { Customer } from "./customer";
export class CustomerRepository {
    get(id) {
        return new Customer(id, "John Doe");
    }
}
