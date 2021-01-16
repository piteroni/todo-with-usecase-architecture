export const types = {
  api: {
    Identification: Symbol.for("api.Identification"),
    User: Symbol.for("api.User")
  },
  vuexContexts: {
    apiToken: Symbol.for("vuexContexts.apiToken"),
  },
  services: {
    ApiTokenReader: Symbol.for("services.ApiTokenReader")
  }
} as const;
