import "reflect-metadata";
import { Container } from "inversify";
import getDecorators from "inversify-inject-decorators";
import { types } from "@/providers/types";
import { ApiTokenReader } from "@/services/ApiTokenReader";

export const container = new Container();

container.bind(types.services.ApiTokenReader).to(ApiTokenReader);

const { lazyInject } = getDecorators(container);

export const Service = lazyInject;
