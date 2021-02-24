export const types = {
  api: {
    Identification: Symbol.for("api.Identification"),
    Credential: Symbol.for("api.Credential"),
    User: Symbol.for("api.User")
  },
  vuexContexts: {
    apiToken: Symbol.for("vuexContexts.apiToken"),
    task: Symbol.for("vuexContexts.task"),
  },
  services: {
    ApiTokenReader: Symbol.for("services.ApiTokenReader")
  }
} as const;
