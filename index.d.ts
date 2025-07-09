/**
 * TypeScript definitions for hardware-identification-addon
 * 
 * A Node.js C++ addon for retrieving hardware identification on Windows platform.
 */

declare module 'hardware-identification-addon' {
    /**
     * Hardware information object containing all hardware identifiers
     */
    export interface HardwareInfo {
        /** CPU processor ID */
        cpuId: string;
        /** Motherboard serial number */
        motherboardSerial: string;
        /** BIOS serial number */
        biosSerial: string;
        /** Array of disk drive serial numbers */
        diskSerials: string[];
        /** Array of network adapter MAC addresses */
        macAddresses: string[];
        /** Unique hardware fingerprint (hash) */
        fingerprint: string;
    }

    /**
     * Hardware summary object with formatted information
     */
    export interface HardwareSummary {
        /** Summary of main hardware identifiers */
        summary: {
            cpuId: string;
            motherboardSerial: string;
            biosSerial: string;
            fingerprint: string;
        };
        /** Detailed information about storage and network */
        details: {
            diskCount: number;
            diskSerials: string[];
            networkAdapterCount: number;
            macAddresses: string[];
        };
    }

    /**
     * Main Hardware Identification class
     */
    export class HardwareId {
        /**
         * Create a new HardwareId instance
         */
        constructor();

        /**
         * Initialize the hardware identification system
         * @returns True if initialization successful, false otherwise
         */
        initialize(): boolean;

        /**
         * Clean up resources
         */
        cleanup(): void;

        /**
         * Check if the system is initialized
         * @returns True if initialized, false otherwise
         */
        isInitialized(): boolean;

        /**
         * Get CPU identifier
         * @returns CPU ID
         * @throws Error if not initialized or operation fails
         */
        getCpuId(): string;

        /**
         * Get motherboard serial number
         * @returns Motherboard serial number
         * @throws Error if not initialized or operation fails
         */
        getMotherboardSerial(): string;

        /**
         * Get BIOS serial number
         * @returns BIOS serial number
         * @throws Error if not initialized or operation fails
         */
        getBiosSerial(): string;

        /**
         * Get disk drive serial numbers
         * @returns Array of disk serial numbers
         * @throws Error if not initialized or operation fails
         */
        getDiskSerials(): string[];

        /**
         * Get network adapter MAC addresses
         * @returns Array of MAC addresses
         * @throws Error if not initialized or operation fails
         */
        getMacAddresses(): string[];

        /**
         * Get hardware fingerprint (combined hash of hardware identifiers)
         * @returns Hardware fingerprint
         * @throws Error if not initialized or operation fails
         */
        getHardwareFingerprint(): string;

        /**
         * Get all hardware information at once
         * @returns Object containing all hardware information
         * @throws Error if not initialized or operation fails
         */
        getAllHardwareInfo(): HardwareInfo;

        /**
         * Get hardware summary (formatted for display)
         * @returns Formatted hardware summary
         */
        getHardwareSummary(): HardwareSummary;
    }

    /**
     * Native addon functions (advanced use)
     */
    export interface NativeAddon {
        initialize(): boolean;
        cleanup(): void;
        getCpuId(): string;
        getMotherboardSerial(): string;
        getBiosSerial(): string;
        getDiskSerials(): string[];
        getMacAddresses(): string[];
        getHardwareFingerprint(): string;
        getAllHardwareInfo(): HardwareInfo;
    }

    // Singleton instance
    export const hardwareId: HardwareId;

    // Direct access to native functions
    export const native: NativeAddon;

    // Convenience functions using singleton
    export function initialize(): boolean;
    export function cleanup(): void;
    export function getCpuId(): string;
    export function getMotherboardSerial(): string;
    export function getBiosSerial(): string;
    export function getDiskSerials(): string[];
    export function getMacAddresses(): string[];
    export function getHardwareFingerprint(): string;
    export function getAllHardwareInfo(): HardwareInfo;
    export function getHardwareSummary(): HardwareSummary;
}
