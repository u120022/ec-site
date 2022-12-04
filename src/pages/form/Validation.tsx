// Inspiration by https://www.solidjs.com/examples/forms

import { createStore } from "solid-js/store";

export type Errors = Record<string, string>;
export type Fields = Record<string, string>;

export const createForm = () => {
  const [fields, setFields] = createStore<Fields>({});
  const [errors, setErrors] = createStore<Errors>({});
  let registry: Record<string, HTMLInputElement | HTMLTextAreaElement> = {};

  const checkValid = (e: HTMLInputElement | HTMLTextAreaElement) => {
    const valid = e.checkValidity();
    setErrors({ [e.name]: e.validationMessage });
    return valid;
  };

  const register = (e: HTMLInputElement | HTMLTextAreaElement) => {
    registry[e.name] = e;
    e.oninput = () => setFields({ [e.name]: e.value });
    e.onblur = () => checkValid(e);
  };

  const validate = () => {
    let valid = true;
    for (const key in registry) {
      valid = checkValid(registry[key]) && valid;
    }
    return valid;
  };

  const clear = () => {
    setFields({});
    for (const key in registry) {
      registry[key].value = "";
    }
  };

  return { fields, errors, validate, clear, register };
};
