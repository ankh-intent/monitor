
import { action, computed, observable } from 'mobx';

export interface NodeStoreInterface {
  all: Node[];
  push(node: Node|Node[]);
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

  @computed
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
  private store = observable.map();

  @computed
  public get all(): Node[] {
    return <any>this.store.values();
  }

  @action('nodes push')
  public push(nodes: Node|Node[]) {
    console.log('pushing');
    if (nodes instanceof Array) {
      for (let node of nodes) {
        this.store.set(node.identifier, node);
      }
    } else {
      this.store.set(nodes.identifier, nodes);
    }
  }

  @action('nodes find')
  public find(identifier: string): Node {
    console.log('finding');
    return <Node>this.store.get(identifier);
  }
}
