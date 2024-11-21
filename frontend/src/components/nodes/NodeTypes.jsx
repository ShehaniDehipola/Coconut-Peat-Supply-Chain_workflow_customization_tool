import ActionNode from './ActionNode';
import CheckNode from './CheckNode';
import WaitNode from './WaitNode';
import TriangleNode from './TriangleNode';

export const nodeTypes = {
  action: ActionNode, // Rectangle
  check: CheckNode,   // Diamond
  wait: WaitNode,     // Circle
  triangle: TriangleNode,
};
