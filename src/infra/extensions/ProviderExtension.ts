import { container } from "tsyringe";
import { DbContext, PgPromiseContext } from "@infra/context";

export class ProviderExtension {
  static init() {
    container.registerSingleton<DbContext>("DbContext", PgPromiseContext);
  }
}
