import "reflect-metadata";
import { Container } from "inversify";
import getDecorators from "inversify-inject-decorators";
import { types } from "@/providers/types";
import { store } from "@/store";
import { apiToken } from "@/store/modules/apiToken";

export const container = new Container();

container.bind(types.vuexContexts.apiToken).toConstantValue(apiToken.context(store));

const { lazyInject } = getDecorators(container);

export const VuexContext = lazyInject;
