/**
 * Security Check Example
 * 
 * This example demonstrates how to use the Hardware Identification Addon
 * for security purposes, such as hardware-based authentication and
 * system validation.
 */

const hardwareId = require('../index');
const fs = require('fs');
const path = require('path');

class HardwareSecurityManager {
    constructor() {
        this.fingerprintFile = path.join(__dirname, 'hardware_fingerprint.json');
    }

    /**
     * Register the current hardware configuration
     */
    async registerHardware() {
        console.log('🔐 Registering hardware configuration...');
        
        if (!hardwareId.initialize()) {
            throw new Error('Failed to initialize hardware identification');
        }

        try {
            const allInfo = hardwareId.getAllHardwareInfo();
            const timestamp = new Date().toISOString();
            
            const registrationData = {
                registeredAt: timestamp,
                fingerprint: allInfo.fingerprint,
                hardware: {
                    cpuId: allInfo.cpuId,
                    motherboardSerial: allInfo.motherboardSerial,
                    biosSerial: allInfo.biosSerial,
                    diskCount: allInfo.diskSerials.length,
                    firstDiskSerial: allInfo.diskSerials[0] || null,
                    networkAdapterCount: allInfo.macAddresses.length,
                    firstMacAddress: allInfo.macAddresses[0] || null
                }
            };

            // Save to file
            fs.writeFileSync(this.fingerprintFile, JSON.stringify(registrationData, null, 2));
            
            console.log('   ✓ Hardware configuration registered successfully');
            console.log(`   ✓ Fingerprint: ${allInfo.fingerprint}`);
            console.log(`   ✓ Registration saved to: ${this.fingerprintFile}`);
            
            return registrationData;
        } finally {
            hardwareId.cleanup();
        }
    }

    /**
     * Validate current hardware against registered configuration
     */
    async validateHardware() {
        console.log('🔍 Validating hardware configuration...');
        
        // Check if registration exists
        if (!fs.existsSync(this.fingerprintFile)) {
            console.log('   ❌ No hardware registration found');
            console.log('   💡 Run registerHardware() first to create a baseline');
            return false;
        }

        if (!hardwareId.initialize()) {
            throw new Error('Failed to initialize hardware identification');
        }

        try {
            // Load registered configuration
            const registeredData = JSON.parse(fs.readFileSync(this.fingerprintFile, 'utf8'));
            
            // Get current configuration
            const currentInfo = hardwareId.getAllHardwareInfo();
            
            console.log('\n   📋 Comparison Report:');
            console.log('   ' + '-'.repeat(50));
            
            // Compare fingerprints
            const fingerprintMatch = registeredData.fingerprint === currentInfo.fingerprint;
            console.log(`   Fingerprint Match: ${fingerprintMatch ? '✓ PASS' : '❌ FAIL'}`);
            console.log(`     Registered: ${registeredData.fingerprint}`);
            console.log(`     Current:    ${currentInfo.fingerprint}`);
            
            // Compare individual components
            const cpuMatch = registeredData.hardware.cpuId === currentInfo.cpuId;
            const motherboardMatch = registeredData.hardware.motherboardSerial === currentInfo.motherboardSerial;
            const biosMatch = registeredData.hardware.biosSerial === currentInfo.biosSerial;
            
            console.log(`\n   CPU ID Match: ${cpuMatch ? '✓ PASS' : '❌ FAIL'}`);
            if (!cpuMatch) {
                console.log(`     Registered: ${registeredData.hardware.cpuId}`);
                console.log(`     Current:    ${currentInfo.cpuId}`);
            }
            
            console.log(`   Motherboard Match: ${motherboardMatch ? '✓ PASS' : '❌ FAIL'}`);
            if (!motherboardMatch) {
                console.log(`     Registered: ${registeredData.hardware.motherboardSerial}`);
                console.log(`     Current:    ${currentInfo.motherboardSerial}`);
            }
            
            console.log(`   BIOS Match: ${biosMatch ? '✓ PASS' : '❌ FAIL'}`);
            if (!biosMatch) {
                console.log(`     Registered: ${registeredData.hardware.biosSerial}`);
                console.log(`     Current:    ${currentInfo.biosSerial}`);
            }

            // Check storage changes
            const diskCountMatch = registeredData.hardware.diskCount === currentInfo.diskSerials.length;
            console.log(`   Disk Count Match: ${diskCountMatch ? '✓ PASS' : '❌ FAIL'}`);
            if (!diskCountMatch) {
                console.log(`     Registered: ${registeredData.hardware.diskCount}`);
                console.log(`     Current:    ${currentInfo.diskSerials.length}`);
            }

            // Overall validation result
            const overallMatch = fingerprintMatch && cpuMatch && motherboardMatch && biosMatch;
            
            console.log('\n   🎯 VALIDATION RESULT:');
            console.log(`   ${overallMatch ? '✅ HARDWARE VERIFIED' : '🚨 HARDWARE MISMATCH DETECTED'}`);
            
            if (!overallMatch) {
                console.log('\n   ⚠️  Security Alert:');
                console.log('   This system does not match the registered hardware configuration.');
                console.log('   Possible causes:');
                console.log('   - Hardware has been changed or replaced');
                console.log('   - Running on a different machine');
                console.log('   - Hardware failure or driver issues');
            }

            return overallMatch;
            
        } finally {
            hardwareId.cleanup();
        }
    }

    /**
     * Generate a security report
     */
    async generateSecurityReport() {
        console.log('📊 Generating security report...');
        
        if (!hardwareId.initialize()) {
            throw new Error('Failed to initialize hardware identification');
        }

        try {
            const currentInfo = hardwareId.getAllHardwareInfo();
            const summary = hardwareId.getHardwareSummary();
            
            let registeredData = null;
            if (fs.existsSync(this.fingerprintFile)) {
                registeredData = JSON.parse(fs.readFileSync(this.fingerprintFile, 'utf8'));
            }

            const report = {
                timestamp: new Date().toISOString(),
                security: {
                    isRegistered: registeredData !== null,
                    isValid: registeredData ? (registeredData.fingerprint === currentInfo.fingerprint) : false,
                    registrationDate: registeredData ? registeredData.registeredAt : null
                },
                current: {
                    fingerprint: currentInfo.fingerprint,
                    hardware: summary.summary,
                    details: summary.details
                },
                registered: registeredData ? registeredData.hardware : null,
                recommendations: []
            };

            // Add recommendations
            if (!report.security.isRegistered) {
                report.recommendations.push('Register hardware configuration for future validation');
            }
            
            if (report.current.details.diskCount === 0) {
                report.recommendations.push('No disk serials found - verify storage devices');
            }
            
            if (report.current.details.networkAdapterCount === 0) {
                report.recommendations.push('No network adapters found - verify network configuration');
            }

            console.log('\n   📄 Security Report:');
            console.log(JSON.stringify(report, null, 2));

            return report;
            
        } finally {
            hardwareId.cleanup();
        }
    }

    /**
     * Remove hardware registration
     */
    removeRegistration() {
        console.log('🗑️  Removing hardware registration...');
        
        if (fs.existsSync(this.fingerprintFile)) {
            fs.unlinkSync(this.fingerprintFile);
            console.log('   ✓ Hardware registration removed');
        } else {
            console.log('   ℹ️  No registration file found');
        }
    }
}

async function securityCheckExample() {
    console.log('Hardware Identification - Security Check Example');
    console.log('=' .repeat(60));
    
    const securityManager = new HardwareSecurityManager();
    
    try {
        console.log('\n1. Checking for existing registration...');
        
        // Try to validate first
        const isValid = await securityManager.validateHardware();
        
        if (!isValid) {
            console.log('\n2. No valid registration found. Creating new registration...');
            await securityManager.registerHardware();
            
            console.log('\n3. Validating newly registered hardware...');
            await securityManager.validateHardware();
        }
        
        console.log('\n4. Generating comprehensive security report...');
        await securityManager.generateSecurityReport();
        
        console.log('\n5. Security demonstration completed!');
        console.log('\n💡 Tips for production use:');
        console.log('   - Store registration data securely (encrypted)');
        console.log('   - Implement proper access controls');
        console.log('   - Log all validation attempts');
        console.log('   - Set up alerts for validation failures');
        console.log('   - Consider multiple validation factors');
        
    } catch (error) {
        console.error('\nError occurred:', error.message);
    }
    
    console.log('\n' + '='.repeat(60));
}

// Export the security manager class
module.exports = {
    HardwareSecurityManager,
    securityCheckExample
};

// Run the example
if (require.main === module) {
    securityCheckExample();
}
