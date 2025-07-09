/**
 * Hardware Identification Addon
 * 
 * A Node.js C++ addon for retrieving hardware identification on Windows platform.
 * This module provides access to various hardware identifiers including CPU ID,
 * motherboard serial, BIOS serial, disk serials, and MAC addresses.
 * 
 * @author Your Name
 * @version 1.0.0
 */

const hardwareAddon = require('./build/Release/hardware_id_addon');

/**
 * @class HardwareId
 * @description Main class for hardware identification functionality
 */
class HardwareId {
    constructor() {
        this.initialized = false;
    }

    /**
     * Initialize the hardware identification system
     * @returns {boolean} True if initialization successful, false otherwise
     */
    initialize() {
        try {
            this.initialized = hardwareAddon.initialize();
            return this.initialized;
        } catch (error) {
            console.error('Failed to initialize hardware identification:', error.message);
            return false;
        }
    }

    /**
     * Clean up resources
     */
    cleanup() {
        try {
            if (this.initialized) {
                hardwareAddon.cleanup();
                this.initialized = false;
            }
        } catch (error) {
            console.error('Failed to cleanup hardware identification:', error.message);
        }
    }

    /**
     * Check if the system is initialized
     * @returns {boolean} True if initialized, false otherwise
     */
    isInitialized() {
        return this.initialized;
    }

    /**
     * Get CPU identifier
     * @returns {string} CPU ID
     * @throws {Error} If not initialized or operation fails
     */
    getCpuId() {
        this._ensureInitialized();
        return hardwareAddon.getCpuId();
    }

    /**
     * Get motherboard serial number
     * @returns {string} Motherboard serial number
     * @throws {Error} If not initialized or operation fails
     */
    getMotherboardSerial() {
        this._ensureInitialized();
        return hardwareAddon.getMotherboardSerial();
    }

    /**
     * Get BIOS serial number
     * @returns {string} BIOS serial number
     * @throws {Error} If not initialized or operation fails
     */
    getBiosSerial() {
        this._ensureInitialized();
        return hardwareAddon.getBiosSerial();
    }

    /**
     * Get disk drive serial numbers
     * @returns {string[]} Array of disk serial numbers
     * @throws {Error} If not initialized or operation fails
     */
    getDiskSerials() {
        this._ensureInitialized();
        return hardwareAddon.getDiskSerials();
    }

    /**
     * Get network adapter MAC addresses
     * @returns {string[]} Array of MAC addresses
     * @throws {Error} If not initialized or operation fails
     */
    getMacAddresses() {
        this._ensureInitialized();
        return hardwareAddon.getMacAddresses();
    }

    /**
     * Get hardware fingerprint (combined hash of hardware identifiers)
     * @returns {string} Hardware fingerprint
     * @throws {Error} If not initialized or operation fails
     */
    getHardwareFingerprint() {
        this._ensureInitialized();
        return hardwareAddon.getHardwareFingerprint();
    }

    /**
     * Get all hardware information at once
     * @returns {Object} Object containing all hardware information
     * @throws {Error} If not initialized or operation fails
     */
    getAllHardwareInfo() {
        this._ensureInitialized();
        return hardwareAddon.getAllHardwareInfo();
    }

    /**
     * Get hardware summary (formatted for display)
     * @returns {Object} Formatted hardware summary
     */
    getHardwareSummary() {
        const info = this.getAllHardwareInfo();
        return {
            summary: {
                cpuId: info.cpuId || 'Not available',
                motherboardSerial: info.motherboardSerial || 'Not available',
                biosSerial: info.biosSerial || 'Not available',
                fingerprint: info.fingerprint || 'Not available'
            },
            details: {
                diskCount: info.diskSerials.length,
                diskSerials: info.diskSerials,
                networkAdapterCount: info.macAddresses.length,
                macAddresses: info.macAddresses
            }
        };
    }

    /**
     * Ensure the system is initialized
     * @private
     * @throws {Error} If not initialized
     */
    _ensureInitialized() {
        if (!this.initialized) {
            throw new Error('Hardware identification not initialized. Call initialize() first.');
        }
    }
}

// Create and export singleton instance
const hardwareId = new HardwareId();

/**
 * Module exports
 */
module.exports = {
    // Main class
    HardwareId,
    
    // Singleton instance (recommended for most use cases)
    hardwareId,
    
    // Direct access to native functions (advanced use)
    native: hardwareAddon,
    
    // Convenience functions using singleton
    initialize: () => hardwareId.initialize(),
    cleanup: () => hardwareId.cleanup(),
    getCpuId: () => hardwareId.getCpuId(),
    getMotherboardSerial: () => hardwareId.getMotherboardSerial(),
    getBiosSerial: () => hardwareId.getBiosSerial(),
    getDiskSerials: () => hardwareId.getDiskSerials(),
    getMacAddresses: () => hardwareId.getMacAddresses(),
    getHardwareFingerprint: () => hardwareId.getHardwareFingerprint(),
    getAllHardwareInfo: () => hardwareId.getAllHardwareInfo(),
    getHardwareSummary: () => hardwareId.getHardwareSummary()
};
