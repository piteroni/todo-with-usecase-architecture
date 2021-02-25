import "reflect-metadata";
import { Container } from "inversify";
import getDecorators from "inversify-inject-decorators";
import { types } from "@/providers/types";
import { apiTokenContext, taskContext } from "@/store";

export const container = new Container();

container.bind(types.vuexContexts.apiToken).toConstantValue(apiTokenContext);
container.bind(types.vuexContexts.task).toConstantValue(taskContext);

const { lazyInject } = getDecorators(container);

export const VuexContext = lazyInject;
