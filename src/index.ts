import "./index.css";

import {
  AdyenCheckout,
  Card,
  CardConfiguration,
  CoreConfiguration,
  ThreeDS2ChallengeConfiguration,
} from "@adyen/adyen-web";
import { paymentMethods } from "./payment-methods";
import schema from "./schema";
import { CheckoutConfiguration, CustomerData, ParsedData } from "./types";

export class Checkout {
  private environment: CoreConfiguration["environment"];
  private clientKey: string;
  private apiUrl: string;
  private sellerKey: string;
  private successReturnUrl: string;
  private errorReturnUrl: string;
  private customerData: CustomerData;
  private onChange: (state: any) => void;
  private onSubmit: (state: any) => void;
  private onSubmitError: (state: any) => void;
  private beforeSubmit: (state: any) => void;
  private afterSubmit: (state: any) => void;
  private showPayButton?: boolean;
  private maskSecurityCode?: boolean;

  constructor(config: CheckoutConfiguration) {
    if (!config) {
      throw "The config object must be provided!";
    }

    const {
      environment,
      clientKey,
      apiUrl,
      sellerKey,
      successReturnUrl,
      errorReturnUrl,
      customerData,
      onChange,
      onSubmit,
      onSubmitError,
      beforeSubmit,
      afterSubmit,
      showPayButton,
      maskSecurityCode,
    } = config;

    this.environment = environment;
    this.clientKey = clientKey;
    this.apiUrl = apiUrl;
    this.sellerKey = sellerKey;
    this.successReturnUrl = successReturnUrl;
    this.errorReturnUrl = errorReturnUrl;
    this.customerData = customerData;
    this.onChange = onChange;
    this.onSubmit = onSubmit;
    this.onSubmitError = onSubmitError;
    this.beforeSubmit = beforeSubmit;
    this.afterSubmit = afterSubmit;
    this.showPayButton = showPayButton;
    this.maskSecurityCode = maskSecurityCode || false;
  }

  async mount(domNodeContainer: string) {
    const elementToRender = document.getElementById(domNodeContainer);
    const threeCheckout = document.createElement("div");
    threeCheckout.setAttribute("id", "three-checkout");
    const container = elementToRender?.parentNode;
    container.insertBefore(threeCheckout, elementToRender);

    if (!elementToRender) {
      throw `Element with id of ${domNodeContainer} not found`;
    }

    const configuration: CoreConfiguration = {
      locale: "pt-br",
      countryCode: "pt-br",
      environment: this.environment,
      clientKey: this.clientKey,
      paymentMethodsResponse: paymentMethods,
      showPayButton:
        this.showPayButton !== undefined ? this.showPayButton : true,
      translations: {
        "pt-br": {
          payButton: "Pagamento",
        },
      },
    };

    const adyenCheckout = await AdyenCheckout(configuration);

    const callbacks = {
      onChange: (state: any) => {
        return this.onChange(state);
      },
      onSubmit: (state: any) => {
        const { error } = schema.validate({
          ...this.customerData,
          onChange: this.onChange,
          onSubmit: this.onSubmit,
          onSubmitError: this.onSubmitError,
          beforeSubmit: this.beforeSubmit,
          afterSubmit: this.afterSubmit,
          successReturnUrl: this.successReturnUrl,
          errorReturnUrl: this.errorReturnUrl,
          apiUrl: this.apiUrl,
          sellerKey: this.sellerKey,
          showPayButton: this.showPayButton,
        });

        if (error) {
          if (this.onSubmitError) {
            console.error(error);
            return this.onSubmitError(error.message);
          } else {
            console.log(error);
            return error.message;
          }
        }

        const { data } = state;
        const { paymentMethod } = data;
        if (this.beforeSubmit) {
          this.beforeSubmit(state);
        }

        return new Promise((resolve, reject) => {
          const parsedData: ParsedData = {
            amount_cents: this.customerData.amount_cents,
            description: this.customerData.description,
            form_payment: this.customerData.form_payment,
            pre_capture: this.customerData.pre_capture,
            card_attributes: {
              holder_name: paymentMethod.holderName,
              number: paymentMethod.encryptedCardNumber,
              expiration_month: paymentMethod.encryptedExpiryMonth,
              expiration_year: paymentMethod.encryptedExpiryYear,
              security_code: paymentMethod.encryptedSecurityCode,
            },
            installment_plan: this.customerData.installment_plan,
            customer: this.customerData.customer,
          };
          if (this.customerData.extract_identification) {
            parsedData.extract_identification =
              this.customerData.extract_identification;
          }

          if (this.customerData.confirmation_required) {
            parsedData.confirmation_required =
              this.customerData.confirmation_required;
          }

          if (this.successReturnUrl) {
            parsedData.success_return_url = this.successReturnUrl;
          }

          if (this.errorReturnUrl) {
            parsedData.error_return_url = this.errorReturnUrl;
          }

          if (this.customerData.active_3ds) {
            parsedData.active_3ds = this.customerData.active_3ds;
          }

          if (this.customerData.service_id) {
            parsedData.service_id = this.customerData.service_id;
          }

          if (this.customerData.protocol) {
            parsedData.protocol = this.customerData.protocol;
          }

          if (this.customerData.risk_custom_field) {
            parsedData.risk_custom_field = this.customerData.risk_custom_field;
          }

          if (
            this.customerData.has_split_rules &&
            this.customerData.split_rules.length
          ) {
            parsedData.has_split_rules = true;
            parsedData.split_rules = this.customerData.split_rules;
          }

          if (
            this.customerData.recurrence &&
            this.customerData.recurrence_day
          ) {
            parsedData.recurrence = this.customerData.recurrence;
            parsedData.recurrence_day = this.customerData.recurrence_day;
          }

          const baseUrl =
            this.apiUrl || "https://api-prod.parcelaexpress.com.br";

          window
            .fetch(baseUrl + `/v2/payments/sellers/${this.sellerKey}`, {
              method: "POST",
              body: JSON.stringify(parsedData),
              headers: { "Content-Type": "application/json" },
            })
            .then((response) => response.json())
            .then((res) => {
              if (res.errors) {
                if (this.onSubmitError) {
                  reject(this.onSubmitError(res.message));
                } else {
                  reject(JSON.parse(res.message));
                }
              }

              if (res.action) {
                const { action } = res;
                const threeDSConfiguration: ThreeDS2ChallengeConfiguration = {
                  size: "02",
                };

                adyenCheckout
                  .createFromAction(action, threeDSConfiguration)
                  .mount("#three-checkout");
              } else {
                resolve(this.onSubmit(res));
              }
            })
            .catch((err) => {
              console.log(err);
              if (this.onSubmitError) {
                reject(this.onSubmitError(err.message));
              } else {
                console.log(err);
                reject(err.message);
              }
            })
            .finally(() => {
              if (this.afterSubmit) {
                this.afterSubmit(state);
              }
            });
        });
      },
    };

    const cardConfiguration: CardConfiguration = {
      maskSecurityCode: this.maskSecurityCode,
      hasHolderName: true,
      holderNameRequired: false,
      onChange: callbacks.onChange,
      onSubmit: callbacks.onSubmit,
    };

    new Card(adyenCheckout, cardConfiguration).mount(
      elementToRender
    );
  }
}
