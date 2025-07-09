#ifndef HARDWARE_IDENTIFIER_H
#define HARDWARE_IDENTIFIER_H

#include <string>
#include <vector>

/**
 * @brief Hardware Identifier class for Windows platform
 * 
 * This class provides methods to retrieve various hardware identifiers
 * from a Windows system using WMI (Windows Management Instrumentation).
 * 
 * Features:
 * - CPU ID retrieval
 * - Motherboard serial number
 * - BIOS serial number
 * - Disk drive serial numbers
 * - Network adapter MAC addresses
 */
class HardwareIdentifier {
public:
    /**
     * @brief Construct a new Hardware Identifier object
     */
    HardwareIdentifier();
    
    /**
     * @brief Destroy the Hardware Identifier object
     */
    ~HardwareIdentifier();

    /**
     * @brief Initialize COM and WMI services
     * @return true if initialization successful, false otherwise
     */
    bool Initialize();

    /**
     * @brief Clean up COM resources
     */
    void Cleanup();

    /**
     * @brief Get CPU identifier (processor ID)
     * @return CPU ID as string, empty if failed
     */
    std::string GetCpuId();

    /**
     * @brief Get motherboard serial number
     * @return Motherboard serial number as string, empty if failed
     */
    std::string GetMotherboardSerial();

    /**
     * @brief Get BIOS serial number
     * @return BIOS serial number as string, empty if failed
     */
    std::string GetBiosSerial();

    /**
     * @brief Get disk drive serial numbers
     * @return Vector of disk serial numbers
     */
    std::vector<std::string> GetDiskSerials();

    /**
     * @brief Get network adapter MAC addresses
     * @return Vector of MAC addresses
     */
    std::vector<std::string> GetMacAddresses();

    /**
     * @brief Generate a combined hardware fingerprint
     * @return Unique hardware fingerprint string
     */
    std::string GetHardwareFingerprint();

private:
    /**
     * @brief Execute WMI query and return string result
     * @param wmiClass WMI class name (e.g., "Win32_Processor")
     * @param property Property name to retrieve
     * @param index Index of the item (default: 0)
     * @return Query result as string
     */
    std::string ExecuteWmiQuery(const std::string& wmiClass, 
                               const std::string& property, 
                               int index = 0);

    /**
     * @brief Execute WMI query and return multiple string results
     * @param wmiClass WMI class name
     * @param property Property name to retrieve
     * @return Vector of query results
     */
    std::vector<std::string> ExecuteWmiQueryMultiple(const std::string& wmiClass, 
                                                    const std::string& property);

    /**
     * @brief Convert wide string to UTF-8 string
     * @param wstr Wide string input
     * @return UTF-8 string output
     */
    std::string WideStringToString(const std::wstring& wstr);

    /**
     * @brief Generate hash from input string (simple hash for fingerprint)
     * @param input Input string to hash
     * @return Hashed string
     */
    std::string GenerateHash(const std::string& input);

private:
    bool m_isInitialized;
    void* m_pWbemLocator;    // IWbemLocator pointer (void* to avoid COM headers in header file)
    void* m_pWbemServices;   // IWbemServices pointer
};

#endif // HARDWARE_IDENTIFIER_H
