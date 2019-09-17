import store from './store';
import { ChainxNode } from '../types';
import { CURRENT_ACCOUNT_KEY } from './keyring';

export const NODE_PREFIX = 'node_';
export const CURRENT_NODE_KEY = 'current_node_key';

const initNodes: ChainxNode[] = [
  {
    name: 'w1.org',
    url: 'wss://w1.chainx.org/ws'
  },
  {
    name: 'w2.org',
    url: 'wss://w2.chainx.org/ws'
  },
  {
    name: 'HashQuark',
    url: 'wss://chainx.hashquark.io'
  },
  {
    name: 'BuildLinks',
    url: 'wss://chainx.buildlinks.org'
  },
  {
    name: 'w1.cn',
    url: 'wss://w1.chainx.org.cn/ws'
  }
];

class Nodes {
  nodes: ChainxNode[];
  currentNode: ChainxNode | null;

  constructor() {
    this.nodes = [];
    this.currentNode = null;
  }

  _reset() {
    this.nodes = [];
    this.currentNode = null;
  }

  async initNodeAndLoadAll() {
    for (let node of initNodes) {
      try {
        await this.addNode(node.name, node.url);
      } catch (e) {
        console.log(`init node ${node.name} failed, maybe exist, ignore`, e);
      }
    }

    await this.setCurrentNode(initNodes[0].url);

    return this.loadAll();
  }

  async loadAll(): Promise<ChainxNode[]> {
    this._reset();

    await store.all((key, item) => {
      if (key.startsWith(NODE_PREFIX)) {
        this.nodes.push(item);
      }
    });

    if (this.nodes.length <= 0) {
      return this.nodes;
    }

    await store.get(CURRENT_NODE_KEY, node => {
      if (!node) {
        this.currentNode = this.nodes[0] || null;
        return;
      }

      const target = this.nodes.find(item => item.url === node.url);
      this.currentNode = target || this.nodes[0];
    });

    return this.nodes;
  }

  async addNode(name: string, url: string): Promise<ChainxNode> {
    const node: ChainxNode = { name, url };

    if (this.nodes.find(item => item.name === name)) {
      return Promise.reject({ message: 'name already exist' });
    }

    if (this.nodes.find(item => item.url === url)) {
      return Promise.reject({ message: 'url already exist' });
    }

    await store.set(`${NODE_PREFIX}${name}`, node, () => {
      this.nodes.push(node);
    });

    return { name, url };
  }

  async setCurrentNode(url: string): Promise<any> {
    const target = this.nodes.find(item => item.url === url);
    if (!target) {
      return Promise.reject({ message: 'url not exist' });
    }

    await store.set(CURRENT_NODE_KEY, target, () => {
      this.currentNode = target;
    });
  }

  async getCurrentNode() {
    return this.currentNode;
  }

  async removeNode(url: string): Promise<any> {
    const target = this.nodes.find(item => item.url === url);
    if (!target) {
      return Promise.reject({ message: 'name not exist' });
    }

    await store.remove(`${NODE_PREFIX}${target.name}`);
    if (this.currentNode && this.currentNode.url === url) {
      await store.remove(CURRENT_ACCOUNT_KEY);
    }

    await this.loadAll();
  }
}

const nodes = new Nodes();

export default nodes;