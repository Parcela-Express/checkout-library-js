# Parcela Express Checkout Library JS

## Importação

Siga as instruções abaixo para realizar a instalação da biblioteca em sua aplicação.

  ```sh
  ...
    <link rel="stylesheet" href="https://parcela-sub-api-components.s3.us-east-1.amazonaws.com/checkout-library-js/v1.7.0/index.css" />
  </head>
  ...
  ```

  ```sh
  ...
  <body>
    <script src="https://parcela-sub-api-components.s3.us-east-1.amazonaws.com/checkout-library-js/v1.7.0/index.js"></script>
  ...
  ```

## Uso

O componente pode ser usado da seguinte forma:

Importe o componente dentro de sua aplicação e adicione uma div container para renderizar o componente:

#### **`index.html`**
  ```html
...
<body>
    <div id='checkout-container'></div>
</body>
...
  ```

#### **`index.js`**
  ```js

const customerData = {
    amount_cents: 1000, //Valor em centavos
    description: "Venda Teste",
    form_payment: "credit",
    installment_plan: {
        number_installments: 1, //Número de parcelas
    },
    customer: {
        email: "teste@fulano.com.br",
        ip: "99.106.129.24",
        first_name: "Testando",
        last_name: "Teste",
        document: "29896147027",
        billing_address: {
            city: "Belo Horizonte",
            country: "BR",
            house_number_or_name: '10',
            postal_code: "31010500",
            state: "MG",
            street: "Rua Adamina",
        },
    },
    has_split_rules: true,
    split_rules: [
        {
          amount: 10000,
          seller_id: "d6a245d2-b705-42a1-8d4a-0956aaa00fed",
          description: "Descrição do split",
        },
        {
          amount: 5000,
          seller_id: "99d1f231-557a-44b9-ae5d-9b5f533c684e",
          no_cost: true,
        }
    ],
    confirmation_required: false,
    active_3ds: true,
    service_id: "seu id (opcional)",
    protocol: "PROTOCOLO123658 (opcional)"
}

const config = {
    clientKey: 'test_IBIF7UD6SNB7ZJG3KVEGM3UP5M57BJ4B',
    environment: 'TEST',
    apiUrl: "https://sandbox.parcelaexpress.com.br",
    sellerKey: "e137d1b6-8f84-4377-ab5c-d27dd24415bd",
    successReturnUrl: "https://success-url.com.br",
    errorReturnUrl: "https://error-url.com.br",
    customerData,
    onChange: (state) => console.log('onc', state),
    onSubmit: (state) => console.log('ons', state),
    onSubmitError: (state) => console.log('onerr', state),
    beforeSubmit: (state) => console.log("before submit", state),
    afterSubmit: (state) => console.log("after submit", state),
    showPayButton: true
};

const checkoutInstance = new window.Checkout.Checkout(config);
checkoutInstance.mount('checkout-container');
  ```


Os campos has_split_rules e split_rules(opcionais) são usados para dividir o valor da venda entre os estabelecimentos
