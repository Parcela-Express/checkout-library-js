type BillingAddress = {
  city: string;
  country: string;
  house_number_or_name: string;
  postal_code: string;
  state: string;
  street: string;
}

type Customer = {
  email: string;
  ip?: string;
  first_name: string;
  last_name: string;
  document?: string;
  billing_address?: BillingAddress;
}

type InstallmentPlan = {
  number_installments: number;
}

type Splits = {
  amount: number;
  seller_id: string;
}

export type CustomerData = {
  amount_cents: number;
  description: string;
  form_payment: string,
  installment_plan: InstallmentPlan;
  customer: Customer;
  pre_capture: boolean;
  split_rules?: Array<Splits>;
  has_split_rules?: boolean;
  confirmation_required?: boolean;
}

export type CheckoutConfiguration = {
  environment: string;
  clientKey: string;
  apiUrl?: string;
  sellerKey: string;
  successReturnUrl: string;
  errorReturnUrl: string;
  customerData: CustomerData;
  onChange: (state: any) => void;
  onSubmit: (state: any) => void;
  onSubmitError?: (state: any) => void;
  beforeSubmit?: (state: any) => void;
  afterSubmit?: (state: any) => void;
};

export type ParsedData = {
  amount_cents: number;
  description: string;
  form_payment?: string;
  pre_capture?: boolean;
  card_attributes: CardAttributes;
  installment_plan: InstallmentPlan;
  customer: Customer;
  sale_id?: string;
  success_return_url?: string;
  error_return_url?: string;
  has_split_rules?: boolean;
  split_rules?: Splits[];
  confirmation_required?: boolean;
}

type CardAttributes = {
  holder_name: string;
  number: string;
  expiration_month: string;
  expiration_year: string;
  security_code: string;  
}