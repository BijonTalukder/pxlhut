const orderModel = require("../Models/orderModel");

class OrderService {
    constructor() {
       this.orderModel = orderModel
    }

    async createOrder(postBody) {
        const order = await this.orderModel.create(postBody);
        return order;
    }

   


}

module.exports = OrderService;
