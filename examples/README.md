# Hardware Identification Addon - Examples

This directory contains various examples demonstrating how to use the Hardware Identification Addon.

## Examples Overview

### 1. Basic Usage (`basic-usage.js`)
- Simple hardware information retrieval
- Error handling
- Proper initialization and cleanup

### 2. Hardware Monitoring (`hardware-monitor.js`)
- Periodic hardware checks
- Change detection
- Logging capabilities

### 3. System Information (`system-info.js`)
- Comprehensive system overview
- Formatted output
- Performance metrics

### 4. Security Application (`security-check.js`)
- Hardware-based security validation
- Fingerprint comparison
- Authentication scenarios

## Running Examples

```bash
# Run basic usage example
node examples/basic-usage.js

# Run hardware monitoring example
node examples/hardware-monitor.js

# Run system information example
node examples/system-info.js

# Run security check example
node examples/security-check.js
```

## Creating Custom Examples

When creating your own examples, remember to:

1. Always call `initialize()` before using the addon
2. Handle errors appropriately
3. Call `cleanup()` when done
4. Test on your target Windows systems
