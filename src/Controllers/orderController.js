const stripe = require("stripe")(process.env.STRIPE_SECRETE_KEY)
const { v4: uuidv4 } = require("uuid");
const ResponseHandler = require("../shared/response.handaler");
const PaymentService = require("../Services/paymentService");
class OrderController {
    constructor(orderService) {


        console.log("orderService", orderService);
        
        this.orderService = orderService;
        this.paymentService = new PaymentService()
    }
    async createOrder(req, res, next) {
        const postBody = req.body;
        try {
            const transactionId = uuidv4();
            const order = await this.orderService.createOrder({
                ...postBody,
                transactionId: transactionId,
            })
            const paymentIntent = await this.paymentService.createPaymentIntent(order,transactionId);
            ResponseHandler.success(res, "Order placed successfully", { order, checkoutUrl: paymentIntent.url }, 201);
        } catch (error) {

            ResponseHandler.error(res, "order not placed", 500, error);
            next(error)

        }
    }
 



    
  
    
    async paymentSuccess(req, res,next) {
        try {
            const result = await this.paymentService.paymentSuccess(req, res);
            
        } catch (error) {
            ResponseHandler.error(res, "payment failed", 500, error);
            next(error)
            
        }

    }

   
}

module.exports = OrderController