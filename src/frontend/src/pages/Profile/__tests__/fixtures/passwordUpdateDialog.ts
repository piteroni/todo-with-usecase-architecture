import { Vue, Component } from "vue-property-decorator";

export const passwordRuleMock = jest.fn();

@Component
export class PasswordRuleWithError extends Vue {
  public get passwordRules() {
    passwordRuleMock();

    return [
      () => "validation-error"
    ];
  }
}
