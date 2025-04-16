const orderModel = require("../Models/orderModel");

const stripe = require("stripe")(process.env.STRIPE_SECRETE_KEY);

class PaymentService {
    async createPaymentIntent(order, transactionId) {
        try {
            console.log(order);

            const lineItems = order.orderItems.map(item => ({
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: item.name || "Unnamed Product",
                        description: item.selectedAttributes
                            ? Object.entries(item.selectedAttributes)
                                .map(([key, value]) => `${key}: ${value}`)
                                .join(", ")
                            : "No attributes selected",
                    },
                    unit_amount: Math.round(parseFloat(item.price) * 100) || 0,
                },
                quantity: item.quantity || 1,
            }));

            if (order.deliveryFee && order.deliveryFee > 0) {
                lineItems.push({
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: "Delivery Fee",
                            description: "Shipping and handling charges",
                        },
                        unit_amount: Math.round(parseFloat(order.deliveryFee) * 100) || 0,
                    },
                    quantity: 1,
                });
            }

            if (order.taxAmount && order.taxAmount > 0) {
                lineItems.push({
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: "Tax",
                            description: "Tax charges",
                        },
                        unit_amount: Math.round(parseFloat(order.taxAmount) * 100) || 0,
                    },
                    quantity: 1,
                });
            }

            const session = await stripe.checkout.sessions.create({
                client_reference_id: transactionId,
                line_items: lineItems,
                mode: "payment",
                success_url: `${process.env.CLIENT_URL}/api/v1/success?sessionId={CHECKOUT_SESSION_ID}&&transactionId=${transactionId}`,
                cancel_url: `${process.env.CLIENT_URL}/cancel`,
            });

            return session;
        } catch (error) {
            console.log(error);
            throw new Error("Payment Intent creation failed");
        }
    }

    async paymentSuccess(req, res) {
        try {

            const session = await stripe.checkout.sessions.retrieve(req.query.sessionId);

            if (session.payment_status === "paid") {
                const transactionId = req.query.transactionId;

                if (!transactionId) {
                    return res.status(400).send("Transaction ID is missing");
                }

                const order = await orderModel.findOne({ transactionId });

                if (!order) {
                    return res.status(404).send("Order not found");
                }

                order.paymentStatus = "paid";
                await order.save();

                // console.log("Updated Order:", order);
                return res.redirect(`${process.env.CLIENT_URL}/success`);
            } else {
                return res.redirect(`${process.env.CLIENT_URL}/cancel`);
            }
        } catch (error) {
            console.error("Error processing payment success:", error);
            return res.redirect(`${process.env.CLIENT_URL}/cancel`);
        }
    }

    async paymentCancel(req, res) {
        return res.redirect(`${process.env.CLIENT_URL}/cancel`);
    }
}

module.exports = PaymentService;
