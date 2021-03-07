import flushPromises from "flush-promises";
import { VTextRule, VTextRuleResponse } from "@/shared/vuetify";

/**
 * マウントが完了するまで待つ.
 */
export const waitUntilForMounted = async (): Promise<void> => {
  await flushPromises();
};

/**
 * 処理が完了するまで待つ.
 */
export const waitUntilForDone = async (): Promise<void> => {
  await flushPromises();
};

/**
 * 配列に格納されたVText Ruleを順次実行する.
 *
 * @param rules
 *   ルールの配列.
 * @param v
 *   ルールに渡す入力.
 * @returns
 *   全てのルールの検証に成功した場合にtrue、ルールの検証に失敗した場合にstringを返す
 *   なお配列の長さが0の場合、undefinedを返す.
 */
export const testVTextRules = (rules: VTextRule[], v: string): true | string | undefined => {
  let response: VTextRuleResponse = true;

  /* eslint-disable no-restricted-syntax */
  for (const rule of rules) {
    response = rule(v);

    if (response !== true) {
      return response;
    }
  }

  return response;
};
