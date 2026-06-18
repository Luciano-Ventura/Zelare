const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
const apiKey = process.env.ABACATEPAY_API_KEY;

const payload = {
  frequency: "ONE_TIME",
  methods: ["PIX"],
  products: [
    {
      externalId: "teste123",
      name: "Plantão Zelare",
      quantity: 1,
      price: 1000,
    }
  ],
  returnUrl: "https://zelare.com",
  completionUrl: "https://zelare.com",
  customer: {
    name: "João Silva",
    cellphone: "48999999999",
    email: "joao@zelare.com",
    taxId: "11144477735",
  }
};

fetch("https://api.abacatepay.com/v1/billing/create", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify(payload),
})
.then(r => r.json())
.then(data => console.log(JSON.stringify(data, null, 2)))
.catch(console.error);
