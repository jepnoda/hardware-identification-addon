/**
 * System Information Example
 * 
 * This example demonstrates how to create a comprehensive system information
 * display using the Hardware Identification Addon.
 */

const hardwareId = require('../index');

function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function getCurrentTimestamp() {
    return new Date().toISOString();
}

async function systemInformationExample() {
    console.log('Hardware Identification - System Information Example');
    console.log('=' .repeat(60));
    console.log(`Report generated: ${getCurrentTimestamp()}`);
    console.log('=' .repeat(60));
    
    try {
        // Initialize
        if (!hardwareId.initialize()) {
            console.error('Failed to initialize hardware identification');
            return;
        }
        
        // Get all hardware information
        const allInfo = hardwareId.getAllHardwareInfo();
        const summary = hardwareId.getHardwareSummary();
        
        // Display comprehensive system information
        console.log('\n🖥️  SYSTEM OVERVIEW');
        console.log('-'.repeat(40));
        console.log(`Operating System: ${process.platform} ${process.arch}`);
        console.log(`Node.js Version: ${process.version}`);
        console.log(`Process ID: ${process.pid}`);
        console.log(`Memory Usage: ${formatBytes(process.memoryUsage().rss)}`);
        
        console.log('\n🔧 HARDWARE IDENTIFICATION');
        console.log('-'.repeat(40));
        console.log(`CPU Identifier: ${allInfo.cpuId || 'Not available'}`);
        console.log(`Motherboard Serial: ${allInfo.motherboardSerial || 'Not available'}`);
        console.log(`BIOS Serial: ${allInfo.biosSerial || 'Not available'}`);
        console.log(`Hardware Fingerprint: ${allInfo.fingerprint || 'Not available'}`);
        
        console.log('\n💿 STORAGE DEVICES');
        console.log('-'.repeat(40));
        console.log(`Total Disk Drives: ${summary.details.diskCount}`);
        if (summary.details.diskSerials.length > 0) {
            summary.details.diskSerials.forEach((serial, index) => {
                console.log(`  Drive ${index + 1}: ${serial || 'Serial not available'}`);
            });
        } else {
            console.log('  No disk serials found');
        }
        
        console.log('\n🌐 NETWORK ADAPTERS');
        console.log('-'.repeat(40));
        console.log(`Total Network Adapters: ${summary.details.networkAdapterCount}`);
        if (summary.details.macAddresses.length > 0) {
            summary.details.macAddresses.forEach((mac, index) => {
                console.log(`  Adapter ${index + 1}: ${mac || 'MAC not available'}`);
            });
        } else {
            console.log('  No MAC addresses found');
        }
        
        console.log('\n📊 SYSTEM METRICS');
        console.log('-'.repeat(40));
        const memUsage = process.memoryUsage();
        console.log(`RSS Memory: ${formatBytes(memUsage.rss)}`);
        console.log(`Heap Used: ${formatBytes(memUsage.heapUsed)}`);
        console.log(`Heap Total: ${formatBytes(memUsage.heapTotal)}`);
        console.log(`External: ${formatBytes(memUsage.external)}`);
        console.log(`Uptime: ${Math.floor(process.uptime())} seconds`);
        
        console.log('\n🔒 SECURITY INFORMATION');
        console.log('-'.repeat(40));
        console.log(`Unique Hardware ID: ${allInfo.fingerprint}`);
        console.log(`Hardware Components: ${[
            allInfo.cpuId ? 'CPU' : null,
            allInfo.motherboardSerial ? 'Motherboard' : null,
            allInfo.biosSerial ? 'BIOS' : null,
            allInfo.diskSerials.length > 0 ? 'Storage' : null,
            allInfo.macAddresses.length > 0 ? 'Network' : null
        ].filter(Boolean).join(', ')}`);
        
        // Generate JSON report
        console.log('\n📄 JSON REPORT');
        console.log('-'.repeat(40));
        const report = {
            timestamp: getCurrentTimestamp(),
            system: {
                platform: process.platform,
                arch: process.arch,
                nodeVersion: process.version,
                pid: process.pid,
                uptime: process.uptime(),
                memoryUsage: process.memoryUsage()
            },
            hardware: allInfo,
            summary: summary
        };
        
        console.log(JSON.stringify(report, null, 2));
        
    } catch (error) {
        console.error('\nError occurred:', error.message);
        console.error('Stack trace:', error.stack);
    } finally {
        hardwareId.cleanup();
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('System information report completed!');
}

// Export for use by other modules
module.exports = {
    systemInformationExample,
    formatBytes,
    getCurrentTimestamp
};

// Run the example
if (require.main === module) {
    systemInformationExample();
}
