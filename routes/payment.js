import { json } from "express";
import express from "express";
const router = express.Router();

router.post("/clientsecret", async (req, res) => {
    const SECRET_KEY = process.env.PAYMOB_KEY || "egy_sk_test_fa0c12f04551b1aa39a80763f28ebbbf71ceec80c0a57f73bb95d1aee5758890";
    console.log(SECRET_KEY);
    
    const requestBody = req.body;
    console.log(requestBody);

    let amount = requestBody.amount;
    amount = amount * 100;
    console.log("amount", amount);
    
    const body = JSON.stringify({
        "amount": amount,
        "currency": "EGP",
        "payment_methods": [
            4998995
        ],
        "billing_data": {
            "apartment": requestBody.apartment,
            "first_name": requestBody.firstName,
            "last_name": requestBody.lastName,
            "street": requestBody.street,
            "phone_number": requestBody.phone,
            "country": "egypt",
            "email": requestBody.email,
            "state": requestBody.state,
        },
        "redirection_url": "https://www.google.com/"
    });

    const paymobResponse = await fetch("https://accept.paymob.com/v1/intention/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + SECRET_KEY,
        },
        redirect: "follow",
        body: body
    });

    console.log(paymobResponse);
    const paymobData = await paymobResponse.json();
    if (paymobResponse.ok) {
        res.json({
            status: true,
            clientSecret: paymobData.client_secret
        });
    }
});

export default router;