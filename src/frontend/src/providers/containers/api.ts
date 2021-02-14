import "reflect-metadata";
import { Container } from "inversify";
import getDecorators from "inversify-inject-decorators";
import { types } from "@/providers/types";
import { Credential } from "@/api/Credential";
import { Identification } from "@/api/Identification";
import { User } from "@/api/User";

export const container = new Container();

container.bind(types.api.Credential).to(Credential);
container.bind(types.api.Identification).to(Identification);
container.bind(types.api.User).to(User);

const { lazyInject } = getDecorators(container);

export const Api = lazyInject;
