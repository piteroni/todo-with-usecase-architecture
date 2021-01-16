export interface VForm {
  validate: () => boolean;
  reset: () => void;
  resetValidation: () => void;
}
