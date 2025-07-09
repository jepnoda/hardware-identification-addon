/**
 * Test file for Hardware Identification Addon
 * 
 * This file demonstrates how to use the hardware identification addon
 * and tests all its functionality.
 */

const hardwareId = require('./index');

/**
 * @function testHardwareIdentification
 * @description Test all hardware identification functions
 */
async function testHardwareIdentification() {
    console.log('='.repeat(60));
    console.log('Hardware Identification Addon Test');
    console.log('='.repeat(60));
    
    try {
        // Test initialization
        console.log('\n1. Initializing hardware identification...');
        const initSuccess = hardwareId.initialize();
        console.log(`   Initialization: ${initSuccess ? 'SUCCESS' : 'FAILED'}`);
        
        if (!initSuccess) {
            console.log('   Cannot proceed without initialization. Exiting...');
            return;
        }
        
        // Test individual functions
        console.log('\n2. Testing individual hardware identification functions:');
        
        // CPU ID
        console.log('\n   📟 CPU Information:');
        try {
            const cpuId = hardwareId.getCpuId();
            console.log(`   CPU ID: ${cpuId || 'Not available'}`);
        } catch (error) {
            console.log(`   CPU ID: Error - ${error.message}`);
        }
        
        // Motherboard Serial
        console.log('\n   🔧 Motherboard Information:');
        try {
            const motherboardSerial = hardwareId.getMotherboardSerial();
            console.log(`   Motherboard Serial: ${motherboardSerial || 'Not available'}`);
        } catch (error) {
            console.log(`   Motherboard Serial: Error - ${error.message}`);
        }
        
        // BIOS Serial
        console.log('\n   💾 BIOS Information:');
        try {
            const biosSerial = hardwareId.getBiosSerial();
            console.log(`   BIOS Serial: ${biosSerial || 'Not available'}`);
        } catch (error) {
            console.log(`   BIOS Serial: Error - ${error.message}`);
        }
        
        // Disk Serials
        console.log('\n   💿 Disk Drive Information:');
        try {
            const diskSerials = hardwareId.getDiskSerials();
            console.log(`   Number of disks found: ${diskSerials.length}`);
            diskSerials.forEach((serial, index) => {
                console.log(`   Disk ${index + 1} Serial: ${serial || 'Not available'}`);
            });
        } catch (error) {
            console.log(`   Disk Serials: Error - ${error.message}`);
        }
        
        // MAC Addresses
        console.log('\n   🌐 Network Adapter Information:');
        try {
            const macAddresses = hardwareId.getMacAddresses();
            console.log(`   Number of network adapters found: ${macAddresses.length}`);
            macAddresses.forEach((mac, index) => {
                console.log(`   Adapter ${index + 1} MAC: ${mac || 'Not available'}`);
            });
        } catch (error) {
            console.log(`   MAC Addresses: Error - ${error.message}`);
        }
        
        // Hardware Fingerprint
        console.log('\n   🔐 Hardware Fingerprint:');
        try {
            const fingerprint = hardwareId.getHardwareFingerprint();
            console.log(`   Fingerprint: ${fingerprint || 'Not available'}`);
        } catch (error) {
            console.log(`   Fingerprint: Error - ${error.message}`);
        }
        
        // Test getAllHardwareInfo function
        console.log('\n3. Testing combined hardware information function:');
        try {
            const allInfo = hardwareId.getAllHardwareInfo();
            console.log('\n   All Hardware Info:');
            console.log('   ', JSON.stringify(allInfo, null, 4));
        } catch (error) {
            console.log(`   All Hardware Info: Error - ${error.message}`);
        }
        
        // Test getHardwareSummary function
        console.log('\n4. Testing hardware summary function:');
        try {
            const summary = hardwareId.getHardwareSummary();
            console.log('\n   Hardware Summary:');
            console.log('   ', JSON.stringify(summary, null, 4));
        } catch (error) {
            console.log(`   Hardware Summary: Error - ${error.message}`);
        }
        
        // Test using the class directly
        console.log('\n5. Testing direct class usage:');
        try {
            const { HardwareId } = require('./index');
            const hwId = new HardwareId();
            
            if (hwId.initialize()) {
                console.log('   Direct class initialization: SUCCESS');
                const directCpuId = hwId.getCpuId();
                console.log(`   Direct CPU ID: ${directCpuId || 'Not available'}`);
                hwId.cleanup();
            } else {
                console.log('   Direct class initialization: FAILED');
            }
        } catch (error) {
            console.log(`   Direct class usage: Error - ${error.message}`);
        }
        
    } catch (error) {
        console.error('\nUnexpected error during testing:', error);
    } finally {
        // Clean up
        console.log('\n6. Cleaning up...');
        try {
            hardwareId.cleanup();
            console.log('   Cleanup: SUCCESS');
        } catch (error) {
            console.log(`   Cleanup: Error - ${error.message}`);
        }
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('Test completed successfully!');
    console.log('='.repeat(60));
}

/**
 * @function demonstrateUsage
 * @description Demonstrate typical usage patterns
 */
function demonstrateUsage() {
    console.log('\n' + '='.repeat(60));
    console.log('Usage Examples');
    console.log('='.repeat(60));
    
    console.log(`
// Example 1: Basic usage with singleton
const hardwareId = require('./index');

if (hardwareId.initialize()) {
    console.log('CPU ID:', hardwareId.getCpuId());
    console.log('Hardware Fingerprint:', hardwareId.getHardwareFingerprint());
    hardwareId.cleanup();
}

// Example 2: Using the class directly
const { HardwareId } = require('./index');
const hwId = new HardwareId();

if (hwId.initialize()) {
    const allInfo = hwId.getAllHardwareInfo();
    console.log('All hardware info:', allInfo);
    hwId.cleanup();
}

// Example 3: Getting a summary
const summary = hardwareId.getHardwareSummary();
console.log('Summary:', summary);
    `);
}

// Run the test
if (require.main === module) {
    testHardwareIdentification()
        .then(() => {
            demonstrateUsage();
            process.exit(0);
        })
        .catch((error) => {
            console.error('Test failed:', error);
            process.exit(1);
        });
}
