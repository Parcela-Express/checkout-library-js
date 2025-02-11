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

#### **`Para Estilizar o componente basta utilizar as seguintes classes no seu próprio css:`**

```
.adyen-checkout__payment-method {
    /* Payment method container */
}
.adyen-checkout__payment-method--selected {
    /* Payment method that has been selected */
}
.adyen-checkout__payment-method__header {
    /* Payment method icon and name */
}
.adyen-checkout__payment-method__radio {
    /* Radio button in payment method header */
}
.adyen-checkout__payment-method__radio--selected {
    /* Selected radio button in payment method header */
}
.adyen-checkout__payment-method__name {
    /* Payment method name in the payment method header */
}
.adyen-checkout__spinner__wrapper {
    /* Spinning icon */
}
.adyen-checkout__button {
    /* Buttons */
}
.adyen-checkout__button--pay {
    /* Pay button */
}
.adyen-checkout__field {
    /* Form field container */
}
.adyen-checkout__label {
    /* Form label container */
}
.adyen-checkout__label__text {
    /* Text element inside the form label container */
}
.adyen-checkout__input {
    /* Input fields */
}
.adyen-checkout__input--error {
    /* Error state for the input fields */
}
.adyen-checkout__error-text {
    /* Error message text */
}
.adyen-checkout__card__cardNumber__input {
    /* Input field for the card number */
}
.adyen-checkout__field--expiryDate {
    /* Input field for the expiry date */
}
.adyen-checkout__field__cvc {
    /* Input field for the CVC security code */
}
.adyen-checkout__card__holderName {
    /* Input field for cardholder name */
}
.adyen-checkout__checkbox__input {
    /* Checkboxes */
}
.adyen-checkout__checkbox__label {
    /* Checkbox labels */
}
.adyen-checkout__radio_group__input {
    /* Radio buttons */
}
.adyen-checkout__dropdown__button {
    /* Dropdown button showing list of options */
}
.adyen-checkout__dropdown__list {
    /* Dropdown list */
}
.adyen-checkout__dropdown__element {
    /* Elements in the dropdown list */
}
.adyen-checkout__link {
    /* Links */
}
```

