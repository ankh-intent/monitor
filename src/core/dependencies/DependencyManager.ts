
import { Dependency, DependencyNode } from './DependencyNode';
import { Eventable } from '../../intent-utils/Eventable';
import { Container } from '../../intent-utils/Container';
import { Objects } from '../../intent-utils/Objects';

export class DependencyManager extends Eventable {
  static RETAIN = 'retain';
  static RELEASE = 'release';

  public roots: Container<DependencyNode> = {};

  public onretain(handler, once?: boolean): number {
    return (
      once
        ? this.once(DependencyManager.RETAIN, handler)
        : this.on(DependencyManager.RETAIN, handler)
    );
  }

  public onrelease(handler, once?: boolean): number {
    return (
      once
        ? this.once(DependencyManager.RELEASE, handler)
        : this.on(DependencyManager.RELEASE, handler)
    );
  }

  public contains(filter: (nodes: DependencyNode) => boolean): DependencyNode {
    for (let node of Objects.iterate(this.roots)) {
      if (filter(node)) {
        return node;
      }
    }

    return null;
  }

  public find(name: string): DependencyNode {
    for (let root of Objects.iterate(this.roots)) {
      let found = root.related(name);

      if (found) {
        return found;
      }
    }

    return null;
  }

  public add(dependency: Dependency): DependencyNode {
    let node = this.roots[dependency.identifier]
      ? this.roots[dependency.identifier]
      : this.roots[dependency.identifier] = this.buildNode(dependency);

    this.emit(DependencyManager.RETAIN, node);

    return node;
  }

  public dependency(dependency: Dependency): DependencyNode {
    return this.find(dependency.identifier) || this.add(dependency);
  }

  public dependants(dependency: Dependency): DependencyNode {
    return new DependencyNode(dependency);
  }

  protected buildNode(dependency: Dependency): DependencyNode {
    let node = new DependencyNode(dependency);

    node.relate(
      Object.keys(dependency.dependencies)
        .map((name) => this.buildNode(dependency.dependencies[name]))
    );

    return node;
  }

  public all(names: string[] = null, filter: boolean = true): (DependencyNode|string)[] {
    if (!names) {
      return Object.keys(this.roots)
        .map((name) => this.roots[name])
      ;
    }

    let nodes = names.map((name) => this.roots[name]);

    return (
      filter
        ? nodes.filter((node) => node)
        : nodes.map((node, index) => node || names[index])
    );
  }

  public remove(node: DependencyNode): number {
    let released = +(delete this.roots[node.dependency.identifier]);

    for (let root of Objects.iterate(this.roots)) {
      released += +root.release(node);
    }

    for (let dependency of node) {
      this.dereference(node, dependency);
    }

    this.emit(DependencyManager.RELEASE, node);

    return released;
  }

  public dereference(parent: DependencyNode, dependency: DependencyNode): boolean {
    if (!parent.release(dependency)) {
      return false;
    }

    let name = dependency.dependency.identifier;

    for (let root of Objects.iterate(this.roots)) {
      if (root === dependency) {
        continue;
      }

      if (root.related(name)) {
        return false;
      }
    }

    return !!this.remove(dependency);
  }
}
