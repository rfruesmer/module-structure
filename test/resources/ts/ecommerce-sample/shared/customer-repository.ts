import {Customer} from "./customer";

export class CustomerRepository {

    get(id: string): Customer {
        return new Customer(id, "John Doe");
    }
}
