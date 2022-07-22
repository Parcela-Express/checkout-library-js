import * as Joi from "joi";

const schema = Joi.object({
  amount_cents: Joi.number().min(1).required(),
  description: Joi.string().required(),
  form_payment: Joi.string(),
  installment_plan: Joi.object({
    number_installments: Joi.number().min(1).max(12),
  }).required(),
  customer: Joi.object({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    email: Joi.alternatives().conditional("form_payment", {
      is: "debit",
      then: Joi.string().required(),
      otherwise: Joi.string(),
    }),
    ip: Joi.alternatives().conditional("form_payment", {
      is: "debit",
      then: Joi.string().required(),
      otherwise: Joi.string(),
    }),
    document: Joi.string(),
    billing_address: Joi.object({
      city: Joi.string().required(),
      country: Joi.string().required(),
      house_number_or_name: Joi.string().required(),
      postal_code: Joi.string().required(),
      state: Joi.string().required(),
      street: Joi.string().required(),
    }),
  }).required(),
  has_split_rules: Joi.boolean(),
  split_rules: Joi.array().items(
    Joi.object({
      amount: Joi.number().required(),
      seller_id: Joi.string().required(),
      no_cost: Joi.boolean(),
      description: Joi.string(),
    })
  ),
  extract_identification: Joi.string(),
  confirmation_required: Joi.boolean(),
  pre_capture: Joi.boolean(),
  onChange: Joi.function().required(),
  onSubmit: Joi.function().required(),
  onSubmitError: Joi.function(),
  beforeSubmit: Joi.function(),
  afterSubmit: Joi.function(),
  successReturnUrl: Joi.string().required(),
  errorReturnUrl: Joi.string().required(),
  apiUrl: Joi.string(),
  sellerKey: Joi.string().uuid().required(),
  showPayButton: Joi.boolean(),
  active_3ds: Joi.boolean(),
  risk_custom_field: Joi.boolean(),
});

export default schema;
