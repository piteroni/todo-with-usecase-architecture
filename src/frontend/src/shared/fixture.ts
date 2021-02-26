import flushPromises from "flush-promises";

/**
 * マウントが完了するまで待つ.
 */
export const waitUntilForMounted = async (): Promise<void> => {
  await flushPromises();
}
