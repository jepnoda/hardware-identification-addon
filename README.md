# Hardware Identification Addon

[![npm version](https://badge.fury.io/js/hardware-identification-addon.svg)](https://badge.fury.io/js/hardware-identification-addon)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Platform](https://img.shields.io/badge/platform-Windows-blue.svg)](https://github.com/jepnoda/hardware-identification-addon)

A powerful and easy-to-use Node.js C++ addon for retrieving hardware identification information on Windows platform. This addon provides access to various hardware identifiers including CPU ID, motherboard serial, BIOS serial, disk serials, and MAC addresses.

## Features

- 🔍 **CPU Identification** - Get processor ID
- 🔧 **Motherboard Serial** - Retrieve motherboard serial number
- 💾 **BIOS Serial** - Get BIOS serial number
- 💿 **Disk Serials** - List all disk drive serial numbers
- 🌐 **MAC Addresses** - Get network adapter MAC addresses
- 🔐 **Hardware Fingerprint** - Generate unique hardware fingerprint
- 📊 **Combined Information** - Get all hardware info at once
- 🛡️ **Error Handling** - Robust error handling and validation
- 📝 **TypeScript Ready** - Includes TypeScript definitions
- 🚀 **ES Module Support** - Works with both CommonJS and ES modules
- ⚡ **Native Performance** - C++ implementation for optimal speed

## Installation

```bash
npm install hardware-identification-addon
```

### Prerequisites

- Node.js 14.0.0 or higher
- Windows operating system (win32)
- Python (for building native modules)
- Visual Studio Build Tools (Windows)

**Note**: This package will automatically build the native addon during installation.

## Quick Start

### CommonJS (require)

```javascript
const hardwareId = require('hardware-identification-addon');

// Initialize the addon
if (hardwareId.initialize()) {
    // Get hardware information
    console.log('CPU ID:', hardwareId.getCpuId());
    console.log('Hardware Fingerprint:', hardwareId.getHardwareFingerprint());
    
    // Clean up when done
    hardwareId.cleanup();
} else {
    console.error('Failed to initialize hardware identification');
}
```

### ES Modules (import)

```javascript
// Named imports
import { initialize, getCpuId, getHardwareFingerprint, cleanup } from 'hardware-identification-addon';

if (initialize()) {
    console.log('CPU ID:', getCpuId());
    console.log('Hardware Fingerprint:', getHardwareFingerprint());
    cleanup();
}

// Or using the class
import { HardwareId } from 'hardware-identification-addon';

const hwId = new HardwareId();
if (hwId.initialize()) {
    const allInfo = hwId.getAllHardwareInfo();
    console.log('All hardware info:', allInfo);
    hwId.cleanup();
}

// Or default import
import hardwareId from 'hardware-identification-addon';

if (hardwareId.initialize()) {
    console.log('Summary:', hardwareId.getHardwareSummary());
    hardwareId.cleanup();
}
```

## API Reference

### Singleton Functions

The module exports convenient singleton functions for immediate use:

#### `initialize(): boolean`
Initialize the hardware identification system. Must be called before using other functions.

#### `cleanup(): void`
Clean up resources. Should be called when done using the addon.

#### `getCpuId(): string`
Get the CPU processor ID.

#### `getMotherboardSerial(): string`
Get the motherboard serial number.

#### `getBiosSerial(): string`
Get the BIOS serial number.

#### `getDiskSerials(): string[]`
Get an array of disk drive serial numbers.

#### `getMacAddresses(): string[]`
Get an array of network adapter MAC addresses.

#### `getHardwareFingerprint(): string`
Get a unique hardware fingerprint (hash of combined hardware identifiers).

#### `getAllHardwareInfo(): object`
Get all hardware information in a single object:

```javascript
{
    cpuId: "string",
    motherboardSerial: "string",
    biosSerial: "string",
    diskSerials: ["string", ...],
    macAddresses: ["string", ...],
    fingerprint: "string"
}
```

#### `getHardwareSummary(): object`
Get a formatted summary of hardware information:

```javascript
{
    summary: {
        cpuId: "string",
        motherboardSerial: "string",
        biosSerial: "string",
        fingerprint: "string"
    },
    details: {
        diskCount: number,
        diskSerials: ["string", ...],
        networkAdapterCount: number,
        macAddresses: ["string", ...]
    }
}
```

### Class Usage

For more control, you can use the `HardwareId` class directly:

```javascript
const { HardwareId } = require('hardware-identification-addon');

const hwId = new HardwareId();
if (hwId.initialize()) {
    const info = hwId.getAllHardwareInfo();
    console.log(info);
    hwId.cleanup();
}
```

## Usage Examples

### Example 1: Basic Hardware Information

```javascript
const hardwareId = require('hardware-identification-addon');

if (hardwareId.initialize()) {
    try {
        console.log('=== Hardware Information ===');
        console.log('CPU ID:', hardwareId.getCpuId());
        console.log('Motherboard Serial:', hardwareId.getMotherboardSerial());
        console.log('BIOS Serial:', hardwareId.getBiosSerial());
        console.log('Hardware Fingerprint:', hardwareId.getHardwareFingerprint());
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        hardwareId.cleanup();
    }
}
```

### Example 2: Complete Hardware Summary

```javascript
const hardwareId = require('hardware-identification-addon');

if (hardwareId.initialize()) {
    try {
        const summary = hardwareId.getHardwareSummary();
        
        console.log('=== Hardware Summary ===');
        console.log('CPU ID:', summary.summary.cpuId);
        console.log('Motherboard Serial:', summary.summary.motherboardSerial);
        console.log('BIOS Serial:', summary.summary.biosSerial);
        console.log('Hardware Fingerprint:', summary.summary.fingerprint);
        
        console.log('\n=== Storage Devices ===');
        console.log(`Found ${summary.details.diskCount} disk(s):`);
        summary.details.diskSerials.forEach((serial, index) => {
            console.log(`  Disk ${index + 1}: ${serial}`);
        });
        
        console.log('\n=== Network Adapters ===');
        console.log(`Found ${summary.details.networkAdapterCount} adapter(s):`);
        summary.details.macAddresses.forEach((mac, index) => {
            console.log(`  Adapter ${index + 1}: ${mac}`);
        });
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        hardwareId.cleanup();
    }
}
```

### Example 3: Using Multiple Instances

```javascript
const { HardwareId } = require('hardware-identification-addon');

// Create multiple instances if needed
const hwId1 = new HardwareId();
const hwId2 = new HardwareId();

// Both can be initialized independently
if (hwId1.initialize() && hwId2.initialize()) {
    console.log('Instance 1 CPU ID:', hwId1.getCpuId());
    console.log('Instance 2 CPU ID:', hwId2.getCpuId());
    
    hwId1.cleanup();
    hwId2.cleanup();
}
```

## Testing

Run the included test to verify everything works:

```bash
npm test
```

The test will:
- Initialize the addon
- Test all hardware identification functions
- Display comprehensive hardware information
- Test error handling
- Clean up resources

## Building from Source

### Build Commands

```bash
# Configure the build
npm run configure

# Build the addon
npm run build

# Clean build files
npm run clean

# Rebuild from scratch
npm run install
```

### Project Structure

```
hardware-identification-addon/
├── src/
│   ├── hardware_identifier.h      # C++ header file
│   ├── hardware_identifier.cpp    # Core C++ implementation
│   └── hardware_id_addon.cpp      # Node.js addon wrapper
├── binding.gyp                    # Build configuration
├── package.json                   # Node.js package configuration
├── index.js                       # JavaScript wrapper and API
├── test.js                        # Test file
└── README.md                      # This file
```

## Technical Details

### C++ Implementation

The addon is built using:
- **Node-API (N-API)** - For stable Node.js integration
- **Windows Management Instrumentation (WMI)** - For hardware queries
- **COM (Component Object Model)** - For Windows system interaction

### Hardware Identifiers

- **CPU ID**: Retrieved from `Win32_Processor.ProcessorId`
- **Motherboard Serial**: Retrieved from `Win32_BaseBoard.SerialNumber`
- **BIOS Serial**: Retrieved from `Win32_BIOS.SerialNumber`
- **Disk Serials**: Retrieved from `Win32_PhysicalMedia.SerialNumber`
- **MAC Addresses**: Retrieved from `Win32_NetworkAdapter.MACAddress`

### Security Considerations

- The addon only reads hardware information, it doesn't modify anything
- All hardware queries are performed through standard Windows APIs
- No elevated privileges required for basic hardware identification
- Hardware fingerprint uses a simple hash algorithm (consider cryptographic hash for production)

## Platform Support

- **Supported**: Windows 10, Windows 11, Windows Server 2016+
- **Architecture**: x64, x86
- **Node.js**: 14.0.0 or higher

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Ensure Visual Studio Build Tools are installed
   - Check that Python is available for node-gyp
   - Try `npm run clean` then `npm run build`

2. **Empty Hardware Information**
   - Some virtual machines may not provide all hardware identifiers
   - Run as administrator if needed
   - Check Windows Management Instrumentation service is running

3. **Initialization Failures**
   - Ensure WMI service is running
   - Check that COM is properly initialized
   - Verify Windows version compatibility

### Debug Mode

Set environment variable for debug output:

```bash
set DEBUG=hardware-id-addon
node test.js
```

## License

MIT License - see LICENSE file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Changelog

### Version 1.0.0
- Initial release
- Basic hardware identification functionality
- Windows platform support
- Comprehensive API and documentation
