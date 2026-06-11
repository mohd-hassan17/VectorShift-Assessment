import { BaseNode } from './BaseNode';
import { getNodeConfig, resolveNodeHandles } from './nodeConfig';

export const ConfiguredNode = ({ id, data, type }) => {
  const config = getNodeConfig(type || data?.nodeType);

  if (!config) {
    return null;
  }

  return (
    <BaseNode
      id={id}
      data={data}
      title={config.title}
      icon={config.icon}
      color={config.accent}
      fields={config.fields || []}
      handles={resolveNodeHandles(config.type, id)}
      minWidth={config.minWidth}
    />
  );
};
