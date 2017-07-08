
import { Container } from '../../intent-utils/Container';

export interface Dependency {
  identifier: string;
  dependencies: Container<Dependency>;
}

export class DependencyNode implements Iterable<DependencyNode> {
  private _related: DependencyNode[];

  public dependency: Dependency;

  public constructor(dependency: Dependency, related: DependencyNode[] = []) {
    this.dependency = dependency;
    this._related = related;
  }

  public relations(): DependencyNode[] {
    return this._related;
  }

  public [Symbol.iterator](): IterableIterator<DependencyNode> {
    return this._related[Symbol.iterator]();
  }

  public relate(nodes: DependencyNode[]): DependencyNode[] {
    for (let node of nodes) {
      let index = this._related.indexOf(node);

      if (index < 0) {
        this._related.push(node);
      }
    }

    return nodes;
  }

  public related(identifier: string): DependencyNode {
    if (this.dependency.identifier === identifier) {
      return this;
    }

    for (let node of this._related) {
      let found;

      if (found = node.related(identifier)) {
        return found;
      }
    }

    return null;
  }

  public release(node: DependencyNode): boolean {
    let index = this._related.indexOf(node);

    if (index >= 0) {
      this._related = this._related.filter((e) => e !== node);
    }

    return index >= 0;
  }
}
