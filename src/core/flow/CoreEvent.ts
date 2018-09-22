
export interface CoreEvent<T> {
  type: string;
  data: T;
  parent: CoreEvent<any>;
  bubble: boolean;

  hasParent(event: CoreEvent<any>): CoreEvent<any>;
  stopPropagation(stop?: boolean);
}

export abstract class BaseCoreEvent<T> implements CoreEvent<T> {
  public type: string;
  public data: T;
  public parent: CoreEvent<any>;
  public bubble: boolean;

  //noinspection TypeScriptAbstractClassConstructorCanBeMadeProtected
  public constructor(data: T, parent?: CoreEvent<any>) {
    this.data = data;
    this.type = (<typeof BaseCoreEvent>this.constructor).type();
    this.parent = parent;
    this.bubble = true;
  }

  public stopPropagation(stop: boolean = true) {
    this.bubble = !stop;
  }

  public hasParent(event: CoreEvent<any>): CoreEvent<any> {
    let parent: CoreEvent<any> = this;

    while (parent) {
      if (parent === event) {
        return this;
      }

      parent = parent.parent;
    }

    return null;
  }

  public lookup(type: string): CoreEvent<any> {
    let parent: CoreEvent<any> = this;

    while (parent) {
      if (parent.type === type) {
        return this.parent;
      }

      parent = parent.parent;
    }

    return null;
  }

  public static type(): string {
    return this.name
      .replace(/Event$/, '')
      .toLowerCase();
  }
}

export interface CoreEventConsumer<T, E extends CoreEvent<T>> {
  supports(event: CoreEvent<any>): boolean;
  consume(event: E): CoreEvent<any> | void;
}
