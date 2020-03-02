import { isCurrentNodeInit, useRedux } from '@chainx/extension-ui/shared';
import Icon from '@chainx/extension-ui/components/Icon';
import React from 'react';
import { NodeInfo } from '@chainx/extension-ui/types';
import { getDelayClass } from '@chainx/extension-ui/pages/Header/utils';
import { setShowNodeMenu } from '@chainx/extension-ui/store/reducers/statusSlice';
import { useDispatch, useSelector } from 'react-redux';
import Delay from '@chainx/extension-ui/pages/Header/Delay';
import {
  mainNetNodesSelector,
  testNetNodesSelector
} from '@chainx/extension-ui/store/reducers/nodeSlice';
import { isTestNetSelector } from '@chainx/extension-ui/store/reducers/networkSlice';

export default function({ history, setNode }) {
  const [{ currentNode }] = useRedux<NodeInfo>('currentNode', {
    name: '',
    url: '',
    delay: ''
  });
  const isTestNet = useSelector(isTestNetSelector);
  const dispatch = useDispatch();

  let nodeList = useSelector(
    isTestNet ? testNetNodesSelector : mainNetNodesSelector
  );

  return (nodeList || []).map((item, index) => (
    <div
      className={
        item.name === currentNode.name ? 'node-item active' : 'node-item'
      }
      key={item.name}
      onClick={() => {
        setNode(item.url);
      }}
    >
      <div className="node-item-active-flag" />
      <div className="node-item-detail">
        <div className="node-item-detail-url">
          <span className="url">{item.url.split('//')[1] || item.url}</span>
          <div
            className={
              isCurrentNodeInit(item, isTestNet)
                ? 'node-item-detail-edit'
                : 'node-item-detail-edit custom'
            }
            onClick={e => {
              e.stopPropagation();
              e.nativeEvent.stopImmediatePropagation();
              dispatch(setShowNodeMenu(false));
              const query = {
                nodeInfo: item,
                type: 'remove'
              };
              history.push({
                pathname: '/addNode',
                query: query
              });
            }}
          >
            <Icon name="Edit" />
          </div>
        </div>
        <span className={`delay ${getDelayClass(item.delay)}`}>
          <Delay delay={item.delay} />
        </span>
      </div>
    </div>
  ));
}
