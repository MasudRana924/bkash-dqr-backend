const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors({ origin: '*' }));
const BASIC_AUTH_USERNAME = "tgvgi8mi6pandacf9m8989tfc";
const BASIC_AUTH_PASSWORD = "p91t1vr47i2s5uces1vdn53ivmq7mamr98dtvsg86j41tc245fs";
const API_KEY = "QOudIwbXVW6cJszYcRpT8agjwTJK38RG4M4IXpaL";
const generateToken = async () => {
    const response = await axios.post(
        'https://auth.vendor.uatmapp.bka.sh/oauth2/token',
        'grant_type=client_credentials',
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            auth: {
                username: BASIC_AUTH_USERNAME,
                password: BASIC_AUTH_PASSWORD
            }
        }
    );
    return response.data.access_token;
};

// QR code generation endpoint
app.post('/generate-qr', async (req, res) => {
    const { amount } = req.body;
    try {
        // Step 1: Generate token
        const accessToken = await generateToken();
        console.log("token",accessToken)
        // Step 2: Generate QR code
        const response = await axios.post(
            'https://vendor.uatmapp.bka.sh/100/vendor-qr-management/dynamic-qr/generate',
            {
                wallet: "01319342449",
                amount: amount,
                expirationTime: "2400",
                additionalInformation: "test-reference",
                paymentTerminal: "TR001",
                invoiceId: "gb1234-shakib_01711118365",
                transactionReference: "CR001",
                invoiceItems: [
                    {
                        itemName: "None",
                        unitPrice: "None",
                        quantity: "None"
                    }
                ]
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                    'X-API-Key': API_KEY
                }
            }
        );
        console.log("response", response.data.qrUrl);
        
        // Assuming the QR code URL is in response.data.qrCodeUrl
        res.json({
            qrCodeUrl: response.data.qrUrl
        });
    } catch (error) {
        console.error('Error generating QR code:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to generate QR code' });
    }
});
const PORT = 8000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
