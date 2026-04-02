import React from 'react';
import * as ProductConfig from '../../../constants/product-config';

// Type for config constants
type ConfigConstants = keyof typeof ProductConfig.PRODUCT_CONFIG_DEFAULTS;

interface ConfigValueProps {
  /**
   * The name of the configuration constant to display
   * Should match the exported constant name from product-config.ts
   */
  name: ConfigConstants;

  /**
   * Optional format for the value display
   */
  format?: 'code' | 'text';
}

/**
 * Component to display product configuration default values
 *
 * This component fetches configuration values from the product-config.ts file,
 * which can be auto-generated (for OpenFGA) or manually maintained (for other products).
 * This ensures the documentation stays synchronized with the actual configuration schema.
 *
 * @example
 * ```mdx
 * The Write API allows up to <ConfigValue name="MAX_TUPLES_PER_WRITE" /> tuples per request.
 * ```
 */
export const ConfigValue: React.FC<ConfigValueProps> = ({ name, format = 'code' }) => {
  const value = ProductConfig.PRODUCT_CONFIG_DEFAULTS[name];

  if (value === undefined) {
    console.warn(`ConfigValue: Unknown configuration constant "${String(name)}"`);
    return <span style={{ color: 'red' }}>[Unknown config: {String(name)}]</span>;
  }

  const displayValue = String(value);

  if (format === 'code') {
    return <code>{displayValue}</code>;
  }

  return <span>{displayValue}</span>;
};

export default ConfigValue;
