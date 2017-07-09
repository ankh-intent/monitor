
import { action, computed, observable } from 'mobx';

export interface NodeStoreInterface {
  all: Node[];
  push(node: Node|Node[]): number;
  find(node: string): Node;
}

export class Node {
  @observable
  private _identifier: string;

  constructor(data = null) {
    if (data) {
      Object.assign(this, data);
    }
  }

  public get identifier(): string {
    return this._identifier;
  }

  public set identifier(value: string) {
    if (this._identifier === value) {
      return;
    }

    this._identifier = value;
  }
}

export class NodeStore implements NodeStoreInterface {
  @observable
  private store: Node[];

  public constructor() {
    this.store = [];
  }

  @computed
  public get all(): Node[] {
    return this.store;
  }

  @action('nodes push')
  public push(node: Node|Node[]): number {
    if (node instanceof Array) {
      this.store = this.store.concat(node);
    } else {
      return this.store.push(node);
    }
  }

  @action('nodes find')
  public find(identifier: string): Node {
    return this.store.find((e) => e.identifier === identifier);
  }
}
