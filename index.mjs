/**
 * Hardware Identification Addon - ES Module
 * 
 * A Node.js C++ addon for retrieving hardware identification on Windows platform.
 * This module provides access to various hardware identifiers including CPU ID,
 * motherboard serial, BIOS serial, disk serials, and MAC addresses.
 * 
 * @author Jeperson Noda
 * @version 1.0.0
 */

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const hardwareAddon = require('./build/Release/hardware_id_addon');

/**
 * @class HardwareId
 * @description Main class for hardware identification functionality
 */
export class HardwareId {
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
     * Get CPU ID
     * @returns {string} CPU identifier
     */
    getCpuId() {
        this._ensureInitialized();
        try {
            return hardwareAddon.getCpuId();
        } catch (error) {
            throw new Error(`Failed to get CPU ID: ${error.message}`);
        }
    }

    /**
     * Get motherboard serial number
     * @returns {string} Motherboard serial
     */
    getMotherboardSerial() {
        this._ensureInitialized();
        try {
            return hardwareAddon.getMotherboardSerial();
        } catch (error) {
            throw new Error(`Failed to get motherboard serial: ${error.message}`);
        }
    }

    /**
     * Get BIOS serial number
     * @returns {string} BIOS serial
     */
    getBiosSerial() {
        this._ensureInitialized();
        try {
            return hardwareAddon.getBiosSerial();
        } catch (error) {
            throw new Error(`Failed to get BIOS serial: ${error.message}`);
        }
    }

    /**
     * Get disk drive serial numbers
     * @returns {string[]} Array of disk serials
     */
    getDiskSerials() {
        this._ensureInitialized();
        try {
            return hardwareAddon.getDiskSerials();
        } catch (error) {
            throw new Error(`Failed to get disk serials: ${error.message}`);
        }
    }

    /**
     * Get MAC addresses of network adapters
     * @returns {string[]} Array of MAC addresses
     */
    getMacAddresses() {
        this._ensureInitialized();
        try {
            return hardwareAddon.getMacAddresses();
        } catch (error) {
            throw new Error(`Failed to get MAC addresses: ${error.message}`);
        }
    }

    /**
     * Get hardware fingerprint (unique hash based on hardware)
     * @returns {string} Hardware fingerprint
     */
    getHardwareFingerprint() {
        this._ensureInitialized();
        try {
            return hardwareAddon.getHardwareFingerprint();
        } catch (error) {
            throw new Error(`Failed to get hardware fingerprint: ${error.message}`);
        }
    }

    /**
     * Get all hardware information in a single call
     * @returns {Object} Object containing all hardware info
     */
    getAllHardwareInfo() {
        this._ensureInitialized();
        try {
            return {
                cpuId: this.getCpuId(),
                motherboardSerial: this.getMotherboardSerial(),
                biosSerial: this.getBiosSerial(),
                fingerprint: this.getHardwareFingerprint(),
                diskSerials: this.getDiskSerials(),
                macAddresses: this.getMacAddresses()
            };
        } catch (error) {
            throw new Error(`Failed to get all hardware info: ${error.message}`);
        }
    }

    /**
     * Get formatted hardware summary
     * @returns {Object} Formatted summary of hardware information
     */
    getHardwareSummary() {
        this._ensureInitialized();
        try {
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
        } catch (error) {
            throw new Error(`Failed to get hardware summary: ${error.message}`);
        }
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
export const hardwareId = new HardwareId();

// Direct access to native functions (advanced use)
export const native = hardwareAddon;

// Convenience functions using singleton
export const initialize = () => hardwareId.initialize();
export const cleanup = () => hardwareId.cleanup();
export const getCpuId = () => hardwareId.getCpuId();
export const getMotherboardSerial = () => hardwareId.getMotherboardSerial();
export const getBiosSerial = () => hardwareId.getBiosSerial();
export const getDiskSerials = () => hardwareId.getDiskSerials();
export const getMacAddresses = () => hardwareId.getMacAddresses();
export const getHardwareFingerprint = () => hardwareId.getHardwareFingerprint();
export const getAllHardwareInfo = () => hardwareId.getAllHardwareInfo();
export const getHardwareSummary = () => hardwareId.getHardwareSummary();

// Default export for convenience
export default {
    HardwareId,
    hardwareId,
    native,
    initialize,
    cleanup,
    getCpuId,
    getMotherboardSerial,
    getBiosSerial,
    getDiskSerials,
    getMacAddresses,
    getHardwareFingerprint,
    getAllHardwareInfo,
    getHardwareSummary
};
