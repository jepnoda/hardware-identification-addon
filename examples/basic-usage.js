/**
 * Basic Usage Example
 * 
 * This example demonstrates the basic usage of the Hardware Identification Addon.
 * It shows how to initialize, get hardware information, and clean up properly.
 */

const hardwareId = require('../index');

async function basicUsageExample() {
    console.log('Hardware Identification - Basic Usage Example');
    console.log('=' .repeat(50));
    
    try {
        // Step 1: Initialize the addon
        console.log('1. Initializing hardware identification...');
        const success = hardwareId.initialize();
        
        if (!success) {
            console.error('Failed to initialize hardware identification');
            return;
        }
        
        console.log('   ✓ Initialization successful');
        
        // Step 2: Get basic hardware information
        console.log('\n2. Retrieving hardware information...');
        
        // Get CPU ID
        const cpuId = hardwareId.getCpuId();
        console.log(`   CPU ID: ${cpuId || 'Not available'}`);
        
        // Get hardware fingerprint
        const fingerprint = hardwareId.getHardwareFingerprint();
        console.log(`   Hardware Fingerprint: ${fingerprint || 'Not available'}`);
        
        // Get motherboard serial
        const motherboardSerial = hardwareId.getMotherboardSerial();
        console.log(`   Motherboard Serial: ${motherboardSerial || 'Not available'}`);
        
        // Step 3: Get summary information
        console.log('\n3. Getting hardware summary...');
        const summary = hardwareId.getHardwareSummary();
        
        console.log('   Summary:');
        console.log(`     - CPU ID: ${summary.summary.cpuId}`);
        console.log(`     - Fingerprint: ${summary.summary.fingerprint}`);
        console.log(`     - Disk Count: ${summary.details.diskCount}`);
        console.log(`     - Network Adapters: ${summary.details.networkAdapterCount}`);
        
        console.log('\n   ✓ Hardware information retrieved successfully');
        
    } catch (error) {
        console.error('Error occurred:', error.message);
    } finally {
        // Step 4: Always clean up
        console.log('\n4. Cleaning up...');
        hardwareId.cleanup();
        console.log('   ✓ Cleanup completed');
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('Basic usage example completed!');
}

// Run the example
if (require.main === module) {
    basicUsageExample();
}
