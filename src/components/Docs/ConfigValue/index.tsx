import React from 'react';
import * as OpenFGAConfig from '../../../constants/openfga-config';

interface ConfigValueProps {
  /**
   * The name of the configuration constant to display
   * Should match the exported constant name from openfga-config.ts
   */
  name: keyof typeof OpenFGAConfig.OPENFGA_CONFIG_DEFAULTS;

  /**
   * Optional format for the value display
   */
  format?: 'code' | 'text';
}

/**
 * Component to display OpenFGA configuration default values
 *
 * This component automatically fetches the current default value from the
 * auto-generated configuration constants, ensuring the documentation
 * stays synchronized with the actual OpenFGA configuration schema.
 *
 * @example
 * ```mdx
 * The Write API allows up to <ConfigValue name="MAX_TUPLES_PER_WRITE" /> tuples per request.
 * ```
 */
export const ConfigValue: React.FC<ConfigValueProps> = ({ name, format = 'code' }) => {
  const value = OpenFGAConfig.OPENFGA_CONFIG_DEFAULTS[name];

  if (value === undefined) {
    console.warn(`ConfigValue: Unknown configuration constant "${name}"`);
    return <span style={{ color: 'red' }}>[Unknown config: {name}]</span>;
  }

  const displayValue = String(value);

  if (format === 'code') {
    return <code>{displayValue}</code>;
  }

  return <span>{displayValue}</span>;
};

export default ConfigValue;
